import styles from './HotCard.module.css';

const SKELETON_ROWS = 10;

export default function Skeleton() {
  return (
    <div className={styles.skeletonBody} aria-busy="true" aria-label="加载中">
      <ul className={styles.skeletonList}>
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <li key={index} className={styles.skeletonRow}>
            <span className={styles.skeletonRank} />
            <span className={styles.skeletonTitle} />
            <span className={styles.skeletonHeat} />
          </li>
        ))}
      </ul>
      <p className={styles.loadingText}>加载中...</p>
    </div>
  );
}
