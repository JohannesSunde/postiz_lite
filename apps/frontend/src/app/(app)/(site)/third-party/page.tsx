import Link from 'next/link';

export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${
    isGeneralServerSide() ? 'Postiz Integrations' : 'Gitroom Integrations'
  }`,
  description: '',
};
export default async function Index() {
  if (process.env.POSTIZ_ENABLE_HEAVY_FEATURES !== 'true') {
    return (
      <div className="flex-1 flex items-center justify-center p-[24px] text-center">
        <div className="max-w-[560px] flex flex-col gap-[16px] rounded-[16px] border border-tableBorder bg-newBgColorInner p-[24px]">
          <div className="text-[24px] font-[700]">
            Integrations are disabled in lite mode
          </div>
          <div className="text-[14px] text-textItemBlur">
            Third-party integrations are hidden on this installation to keep
            the default runtime light.
          </div>
          <div>
            <Link
              href="/launches"
              className="inline-flex items-center justify-center rounded-[8px] bg-newColColor px-[16px] py-[10px] text-[14px] font-[600]"
            >
              Go to Launches
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const { ThirdPartyComponent } = await import(
    '@gitroom/frontend/components/third-parties/third-party.component'
  );
  return <ThirdPartyComponent />;
}
