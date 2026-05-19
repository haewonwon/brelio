import Button from './ui/Button';
import Card from './ui/Card';

function EmptyState() {
  return (
    <Card>
      <div className="flex flex-col gap-3">
        <h2 className="m-0 text-2xl font-bold leading-snug text-brelio-text">
          아직 등록된 뉴스가 없습니다
        </h2>
        <p className="m-0 text-base leading-relaxed text-brelio-muted">
          오늘의 경제 뉴스를 불러오면 이 공간에서 요약을 읽고 학습 메모를 남길 수 있어요.
        </p>
        <div className="pt-2">
          <Button>첫 학습 화면 둘러보기</Button>
        </div>
      </div>
    </Card>
  );
}

export default EmptyState;
