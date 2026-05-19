type AppHeaderProps = {
  title: string;
  description: string;
};

function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="rounded-card border border-brelio-border bg-brelio-surface px-6 py-6 shadow-card sm:px-8 sm:py-8">
      <p className="m-0 text-xs font-semibold uppercase tracking-[0.08em] text-brelio-secondary">
        Brelio Learning Tracker
      </p>
      <h1 className="mt-2 text-[2rem] font-bold leading-tight text-brelio-text sm:text-[2.25rem]">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-brelio-muted">{description}</p>
    </header>
  );
}

export default AppHeader;
