'use client';

import { useSearchParams } from 'next/navigation';
import { FC, useCallback, useEffect } from 'react';
const ReturnUrlComponent: FC = () => {
  const params = useSearchParams();
  const url = params.get('returnUrl');
  useEffect(() => {
    if (!url) {
      return;
    }

    try {
      const target = new URL(url, window.location.origin);
      if (target.origin === window.location.origin) {
        localStorage.setItem(
          'returnUrl',
          `${target.pathname}${target.search}${target.hash}`
        );
      }
    } catch {
      localStorage.removeItem('returnUrl');
    }
  }, [url]);
  return null;
};
export const useReturnUrl = () => {
  return {
    getAndClear: useCallback(() => {
      const data = localStorage.getItem('returnUrl');
      localStorage.removeItem('returnUrl');
      return data;
    }, []),
  };
};
export default ReturnUrlComponent;
