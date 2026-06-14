import { useTimeAgo } from '../../hooks/useTimeAgo';
import { useTheme } from '../../hooks/useTheme';

interface UpdatedAtFooterProps {
  updatedAt: string;
  fromCache?: boolean;
}

export default function UpdatedAtFooter({ updatedAt, fromCache }: UpdatedAtFooterProps) {
  const { isCyber } = useTheme();
  const timeAgo = useTimeAgo(updatedAt);

  return (
    <footer
      className={
        isCyber
          ? 'mt-auto flex flex-col items-end gap-1 border-t border-cyan-neon/10 px-4 py-2.5 text-right font-display text-xs text-[#8A8A8A] sm:px-5 sm:py-3'
          : 'mt-auto flex flex-col items-end gap-1 border-t border-border px-4 py-2.5 text-right text-xs text-text-muted sm:px-5 sm:py-3'
      }
      title={
        fromCache
          ? '数据来自服务端缓存；updatedAt 为写入缓存的时刻，缓存有效期内刷新页面该时间不会变化，属正常现象'
          : undefined
      }
    >
      <span>{isCyber ? `> SYNC :: ${timeAgo}` : `更新于 ${timeAgo}`}</span>
      {fromCache ? (
        <span className={isCyber ? 'text-[0.6875rem] text-[#8A8A8A]/70' : 'text-[0.6875rem] text-text-muted/80'}>
          {isCyber ? 'cache_locked' : '缓存有效期内时间不变'}
        </span>
      ) : null}
    </footer>
  );
}
