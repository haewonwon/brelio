import AppHeader from '../components/AppHeader';
import EmptyState from '../components/EmptyState';
import Card from '../components/ui/Card';

function HomePage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-layout px-4 pb-14 pt-6 sm:px-6 sm:pt-8">
      <AppHeader
        title="경제 뉴스 학습 트래커"
        description="경제 뉴스를 읽고, 요약하고, 메모하며 매일 공부를 기록하는 서비스"
      />

      <main className="mt-5 grid gap-4 sm:gap-5">
        <Card className="bg-gradient-to-r from-brelio-primary/10 to-brelio-secondary/10">
          <p className="m-0 text-sm font-semibold text-brelio-primary">오늘의 학습 포커스</p>
          <p className="m-0 mt-2 text-lg font-semibold text-brelio-text">
            핵심 뉴스 1개를 읽고 3줄 요약을 남겨보세요.
          </p>
        </Card>

        <EmptyState />
      </main>
    </div>
  );
}

export default HomePage;
