import Button from './ui/Button';
import Card from './ui/Card';

function EmptyState() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brelio-accent/55">
            <span className="text-xl" aria-hidden="true">
              🗂️
            </span>
          </div>
          <div>
            <h2 className="m-0 text-2xl font-bold leading-snug text-brelio-text">아직 등록된 뉴스가 없습니다</h2>
            <p className="m-0 mt-1 text-sm text-brelio-muted">처음 시작하는 학습자를 위한 기본 화면입니다.</p>
          </div>
        </div>

        <p className="m-0 text-base leading-relaxed text-brelio-muted">
          오늘의 경제 뉴스를 불러오면 이 공간에서 요약을 읽고, 핵심 메모를 남기고, 매일 학습 기록을
          쌓을 수 있어요.
        </p>

        <div className="flex flex-col gap-2 rounded-2xl border border-brelio-border bg-brelio-background p-4 text-sm text-brelio-muted">
          <strong className="text-brelio-text">다음에 구현될 기능</strong>
          <span>• 기사 목록과 상세 보기</span>
          <span>• 개인 메모와 일일 학습 완료 체크</span>
        </div>

        <div>
          <Button>첫 기사 불러오기 준비하기</Button>
        </div>
      </div>
    </Card>
  );
}

export default EmptyState;
