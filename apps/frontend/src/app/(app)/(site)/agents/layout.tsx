import { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'Postiz - Agent',
  description: 'agents',
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.POSTIZ_ENABLE_HEAVY_FEATURES !== 'true') {
    return (
      <div className="flex-1 flex items-center justify-center p-[24px] text-center">
        <div className="max-w-[560px] flex flex-col gap-[16px] rounded-[16px] border border-tableBorder bg-newBgColorInner p-[24px]">
          <div className="text-[24px] font-[700]">AI features are disabled</div>
          <div className="text-[14px] text-textItemBlur">
            This server is running in lite mode, so the agent workspace is not
            available. You can keep scheduling posts and managing channels, or
            switch heavy features back on to use Copilot.
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
  const { Agent } = await import('@gitroom/frontend/components/agents/agent');
  return <Agent>{children}</Agent>;
}
