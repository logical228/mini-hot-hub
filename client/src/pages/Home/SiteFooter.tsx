import { CONTACT_EMAIL, getCacheTtlMinutes } from '../../constants/site';

const DATA_SOURCES = [
  { name: '微博', url: 'https://s.weibo.com/top/summary' },
  { name: '知乎', url: 'https://www.zhihu.com/hot' },
  { name: 'B站', url: 'https://www.bilibili.com/v/popular/rank/all' },
] as const;

export default function SiteFooter() {
  const cacheMinutes = getCacheTtlMinutes();

  return (
    <footer className="mt-12 border-t border-border/60 px-3 py-8 sm:mt-16 sm:px-4 sm:py-10">
      <div className="mx-auto max-w-2xl space-y-3 text-center text-xs leading-relaxed text-text-muted">
        <p className="m-0 font-medium text-text-secondary">
          本站为个人学习项目，仅供技术交流与学习，非商用、非官方产品。
        </p>

        <p className="m-0">
          榜单数据来源于
          {DATA_SOURCES.map((source, index) => (
            <span key={source.url}>
              {index > 0 ? '、' : ''}
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary underline-offset-2 transition-colors hover:text-zhihu hover:underline"
              >
                {source.name}
              </a>
            </span>
          ))}
          等平台的公开信息，由后端聚合展示，不代表各平台官方立场。
        </p>

        <p className="m-0">
          数据约每 <strong className="font-semibold text-text-secondary">{cacheMinutes}</strong>{' '}
          分钟更新一次（与服务端缓存策略 <code className="text-[0.6875rem]">CACHE_TTL</code>{' '}
          一致）；缓存有效期内「更新于」时间可能不变，属正常现象。
        </p>

        <p className="m-0 text-[0.6875rem] text-text-muted/85">
          热搜标题与内容版权归原作者及原平台所有，请通过条目链接访问原文。若认为存在侵权或违规信息，请联系{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-text-secondary underline-offset-2 transition-colors hover:text-zhihu hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          （占位邮箱，部署时请替换）。
        </p>
      </div>
    </footer>
  );
}
