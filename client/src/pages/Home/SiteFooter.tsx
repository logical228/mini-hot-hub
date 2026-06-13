import styles from './Home.module.css';

const DATA_SOURCES = [
  { name: '微博热搜', url: 'https://s.weibo.com/top/summary' },
  { name: '知乎热榜', url: 'https://www.zhihu.com/hot' },
  { name: 'B站热搜', url: 'https://www.bilibili.com/v/popular/rank/all' },
] as const;

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerLine}>学习项目 · 仅供个人学习交流 · 非商用</p>
      <p className={styles.footerLine}>
        <span>数据来源：</span>
        {DATA_SOURCES.map((source, index) => (
          <span key={source.url}>
            {index > 0 ? <span className={styles.footerSep}> / </span> : null}
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              {source.name}
            </a>
          </span>
        ))}
      </p>
      <p className={styles.footerDisclaimer}>
        本页面仅聚合展示各平台公开热榜信息，不代表官方立场；内容版权归原作者所有，请通过原文链接访问。
      </p>
    </footer>
  );
}
