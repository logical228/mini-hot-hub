import HotCard from '../../components/HotCard';
import { PLATFORM_PLACEHOLDERS } from '../../constants/platforms';
import { useHotList } from '../../hooks/useHotList';
import SiteFooter from './SiteFooter';
import styles from './Home.module.css';

export default function Home() {
  // 单次 GET /api/hot → platforms[]，三卡片均由接口数据驱动
  const { platforms, loading, error, refetch } = useHotList();

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <h1 className={styles.siteName}>迷你今日热榜</h1>
        <p className={styles.tagline}>60 秒内掌握中文互联网正在发生的事</p>
      </header>

      <main className={styles.main}>
        {error && !loading ? (
          <div className={styles.pageError}>
            <p className={styles.pageErrorMessage}>{error}</p>
            <button type="button" className={styles.pageRetryButton} onClick={() => void refetch()}>
              点击重试
            </button>
          </div>
        ) : (
          <div className={styles.grid} aria-busy={loading}>
            {loading
              ? PLATFORM_PLACEHOLDERS.map((placeholder) => (
                  <HotCard
                    key={placeholder.source}
                    loading
                    data={{
                      ...placeholder,
                      updatedAt: '',
                      items: [],
                    }}
                  />
                ))
              : platforms.map((platform) => (
                  <HotCard key={platform.source} loading={false} data={platform} />
                ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
