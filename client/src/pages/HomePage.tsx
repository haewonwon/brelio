import AppHeader from '../components/AppHeader';
import EmptyState from '../components/EmptyState';

function HomePage() {
  return (
    <div className="app-shell">
      <AppHeader
        title="경제 뉴스 학습 트래커"
        description="경제 뉴스를 읽고, 요약하고, 메모하며 매일 공부를 기록하는 서비스"
      />

      <main className="app-main">
        <EmptyState />
      </main>
    </div>
  );
}

export default HomePage;
