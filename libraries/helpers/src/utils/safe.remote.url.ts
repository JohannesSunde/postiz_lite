import { Buffer } from 'node:buffer';
import dns from 'node:dns/promises';
import net from 'node:net';

const PRIVATE_IPV4_RANGES: Array<[number, number]> = [
  [ipToNumber('0.0.0.0'), ipToNumber('0.255.255.255')],
  [ipToNumber('10.0.0.0'), ipToNumber('10.255.255.255')],
  [ipToNumber('100.64.0.0'), ipToNumber('100.127.255.255')],
  [ipToNumber('127.0.0.0'), ipToNumber('127.255.255.255')],
  [ipToNumber('169.254.0.0'), ipToNumber('169.254.255.255')],
  [ipToNumber('172.16.0.0'), ipToNumber('172.31.255.255')],
  [ipToNumber('192.0.0.0'), ipToNumber('192.0.0.255')],
  [ipToNumber('192.0.2.0'), ipToNumber('192.0.2.255')],
  [ipToNumber('192.168.0.0'), ipToNumber('192.168.255.255')],
  [ipToNumber('198.18.0.0'), ipToNumber('198.19.255.255')],
  [ipToNumber('198.51.100.0'), ipToNumber('198.51.100.255')],
  [ipToNumber('203.0.113.0'), ipToNumber('203.0.113.255')],
  [ipToNumber('224.0.0.0'), ipToNumber('255.255.255.255')],
];

function ipToNumber(ip: string) {
  return ip
    .split('.')
    .reduce((sum, octet) => (sum << 8) + Number(octet), 0) >>> 0;
}

function isPrivateIPv4(ip: string) {
  const num = ipToNumber(ip);
  return PRIVATE_IPV4_RANGES.some(([start, end]) => num >= start && num <= end);
}

function isPrivateIPv6(ip: string) {
  const normalized = ip.toLowerCase();
  const mappedIPv4 = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mappedIPv4) {
    return isPrivateIPv4(mappedIPv4[1]);
  }

  return (
    normalized === '::' ||
    normalized === '::1' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80') ||
    normalized.startsWith('ff') ||
    normalized.startsWith('2001:db8')
  );
}

function isPrivateAddress(address: string) {
  const type = net.isIP(address);
  if (type === 4) {
    return isPrivateIPv4(address);
  }

  if (type === 6) {
    return isPrivateIPv6(address);
  }

  return false;
}

async function assertPublicHostname(hostname: string) {
  const normalized = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (normalized === 'localhost' || normalized.endsWith('.localhost')) {
    throw new Error('Localhost URLs are not allowed');
  }

  if (net.isIP(normalized)) {
    if (isPrivateAddress(normalized)) {
      throw new Error('Private network URLs are not allowed');
    }
    return;
  }

  const addresses = await dns.lookup(normalized, { all: true, verbatim: false });
  if (!addresses.length) {
    throw new Error('URL host could not be resolved');
  }

  if (addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error('Private network URLs are not allowed');
  }
}

export async function assertSafeRemoteUrl(
  rawUrl: string,
  options: { allowedExtensions?: string[] } = {}
) {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error('Invalid URL');
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('Only HTTP(S) URLs are allowed');
  }

  if (options.allowedExtensions?.length) {
    const pathname = decodeURIComponent(parsed.pathname).toLowerCase();
    if (
      !options.allowedExtensions.some((extension) =>
        pathname.endsWith(extension.toLowerCase())
      )
    ) {
      throw new Error(
        `URL must end with one of: ${options.allowedExtensions.join(', ')}`
      );
    }
  }

  await assertPublicHostname(parsed.hostname);
  return parsed;
}

export async function safeRemoteFetch(
  rawUrl: string,
  init: RequestInit = {},
  options: { allowedExtensions?: string[]; maxRedirects?: number } = {}
) {
  let nextUrl = await assertSafeRemoteUrl(rawUrl, options);
  const maxRedirects = options.maxRedirects ?? 3;

  for (let redirect = 0; redirect <= maxRedirects; redirect++) {
    const response = await fetch(nextUrl, {
      ...init,
      redirect: 'manual',
    });

    if (
      response.status >= 300 &&
      response.status < 400 &&
      response.headers.has('location')
    ) {
      if (redirect === maxRedirects) {
        throw new Error('Too many redirects');
      }

      const location = response.headers.get('location')!;
      nextUrl = await assertSafeRemoteUrl(new URL(location, nextUrl).toString(), options);
      continue;
    }

    return response;
  }

  throw new Error('Too many redirects');
}

export async function readLimitedResponseBuffer(
  response: Response,
  maxBytes: number
) {
  const contentLength = Number(response.headers.get('content-length') || 0);
  if (contentLength > maxBytes) {
    throw new Error('Remote file is too large');
  }

  if (!response.body) {
    return Buffer.alloc(0);
  }

  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error('Remote file is too large');
    }

    chunks.push(Buffer.from(value));
  }

  return Buffer.concat(chunks, total);
}
