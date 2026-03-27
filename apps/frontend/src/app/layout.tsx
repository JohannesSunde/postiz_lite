import './global.scss';
import 'react-tooltip/dist/react-tooltip.css';
import '@copilotkit/react-ui/styles.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import clsx from 'clsx';
import { ReactNode } from 'react';

const jakartaSans = Plus_Jakarta_Sans({
  weight: ['600', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={clsx(jakartaSans.className, 'dark text-primary !bg-primary')}>
        {children}
      </body>
    </html>
  );
}
