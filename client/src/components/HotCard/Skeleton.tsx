const SKELETON_ROWS = 10;

export default function Skeleton() {
  return (
    <div className="flex flex-1 flex-col py-2" aria-busy="true" aria-label="加载中">
      <ul className="flex-1 list-none p-0 m-0">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <li
            key={index}
            className="grid grid-cols-[28px_1fr_48px] items-center gap-2 px-4 py-2 sm:gap-2.5 sm:px-5 sm:py-2.5"
          >
            <span className="h-5 w-5 rounded skeleton-shimmer" />
            <span className="h-3.5 rounded skeleton-shimmer" />
            <span className="h-3 w-12 justify-self-end rounded skeleton-shimmer" />
          </li>
        ))}
      </ul>
      <p className="mt-2 px-4 text-center text-sm text-text-muted sm:px-5">加载中...</p>
    </div>
  );
}
