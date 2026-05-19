type AppHeaderProps = {
  title: string;
  description: string;
};

function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="app-header">
      <p className="app-header__badge">Economy Learning</p>
      <h1 className="app-header__title">{title}</h1>
      <p className="app-header__description">{description}</p>
    </header>
  );
}

export default AppHeader;
