function EmptyState() {
  return (
    <section className="empty-state" aria-live="polite">
      <h2 className="empty-state__title">아직 등록된 뉴스가 없습니다</h2>
      <p className="empty-state__description">
        첫 경제 기사를 불러오면 이 영역에서 요약과 학습 기록을 확인할 수 있어요.
      </p>
    </section>
  );
}

export default EmptyState;
