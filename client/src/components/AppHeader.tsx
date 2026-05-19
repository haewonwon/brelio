type AppHeaderProps = {
  title: string;
  description: string;
};

function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="rounded-card border border-brelio-border bg-brelio-surface p-6 shadow-card sm:p-8">
      <div className="mb-4 inline-flex items-center gap-2 rounded-pill bg-brelio-background px-3 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-brelio-primary" />
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-brelio-muted">
          Calm Finance Learning
        </span>
      </div>

      <h1 className="m-0 text-[2rem] font-bold leading-tight text-brelio-text sm:text-[2.5rem]">{title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-brelio-muted">{description}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-brelio-background px-4 py-3">
          <p className="m-0 text-xs text-brelio-muted">오늘 읽기</p>
          <p className="m-0 mt-1 text-lg font-semibold text-brelio-text">0개</p>
        </div>
        <div className="rounded-2xl bg-brelio-background px-4 py-3">
          <p className="m-0 text-xs text-brelio-muted">학습 메모</p>
          <p className="m-0 mt-1 text-lg font-semibold text-brelio-text">0개</p>
        </div>
        <div className="col-span-2 rounded-2xl bg-brelio-background px-4 py-3 sm:col-span-1">
          <p className="m-0 text-xs text-brelio-muted">연속 기록</p>
          <p className="m-0 mt-1 text-lg font-semibold text-brelio-success">0일</p>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
