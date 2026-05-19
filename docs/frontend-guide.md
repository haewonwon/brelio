# Frontend Guide

이 문서는 Economy News Tracker의 프론트엔드 개발 규칙입니다.
입문자가 작업하더라도 코드 스타일과 구조가 크게 흔들리지 않도록, 작게 만들고 명확하게 나누는 것을 목표로 합니다.

## 기본 원칙

- TypeScript로 작성합니다.
- React 함수 컴포넌트를 사용합니다.
- 한 번에 많은 기능을 만들지 않습니다.
- 화면, API 요청, 타입, 공통 UI를 역할별로 분리합니다.
- 복잡한 추상화보다 읽기 쉬운 코드를 우선합니다.
- 하드코딩된 서버 주소, 토큰, 비밀값을 넣지 않습니다.
- 이벤트 핸들러 이름은 `handle`로 시작합니다.

좋은 예:

```tsx
function ArticleCard() {
  const handleOpenArticle = () => {
    // ...
  };

  return <button onClick={handleOpenArticle}>Read</button>;
}
```

피해야 할 예:

```tsx
function ArticleCard() {
  const click = () => {
    // 이름만 봐서는 무엇을 하는지 알기 어렵습니다.
  };

  return <button onClick={click}>Read</button>;
}
```

## 권장 폴더 구조

프론트엔드 코드는 `client/src` 아래에 둡니다.

```txt
client/src/
  api/
    articleApi.ts
  components/
    ArticleCard.tsx
  pages/
    ArticleListPage.tsx
    ArticleDetailPage.tsx
  routes/
    AppRoutes.tsx
  types/
    article.ts
  App.tsx
  main.tsx
  styles.css
```

처음부터 모든 폴더를 만들 필요는 없습니다.
기능이 생길 때 필요한 폴더만 추가합니다.

## 파일 역할

- `pages`: 라우트에 직접 연결되는 화면입니다.
- `components`: 여러 화면에서 재사용하거나 화면 안에서 분리할 UI입니다.
- `api`: 서버와 통신하는 함수입니다.
- `types`: 여러 파일에서 공유하는 TypeScript 타입입니다.
- `routes`: React Router 설정입니다.

한 파일에 화면, API 요청, 타입, 복잡한 상태 로직을 모두 넣지 않습니다.

## 컴포넌트 규칙

- 컴포넌트 파일 이름은 PascalCase를 사용합니다.
- 컴포넌트는 가능하면 한 가지 역할만 맡습니다.
- props 타입은 컴포넌트 위에 선언합니다.
- props 이름은 구체적으로 작성합니다.
- UI가 100줄을 크게 넘고 역할이 섞이면 컴포넌트 분리를 검토합니다.

좋은 예:

```tsx
type ArticleCardProps = {
  title: string;
  summary: string;
  sourceName: string;
  onOpen: () => void;
};

function ArticleCard({ title, summary, sourceName, onOpen }: ArticleCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{summary}</p>
      <span>{sourceName}</span>
      <button type="button" onClick={onOpen}>
        Open
      </button>
    </article>
  );
}

export default ArticleCard;
```

## TypeScript 규칙

- `any`는 사용하지 않습니다. 정말 필요하면 먼저 타입을 좁힐 방법을 찾습니다.
- 서버에서 받는 데이터 타입은 `types` 폴더에 둡니다.
- optional 값은 화면에 표시하기 전에 기본값이나 조건 처리를 합니다.
- API 응답 타입과 화면에서 쓰는 타입이 달라지면 변환 함수를 둡니다.

좋은 예:

```ts
export type Article = {
  id: string;
  title: string;
  summary: string;
  originalUrl: string;
  publishedAt: string;
};
```

## API 요청 규칙

- API 요청은 컴포넌트 안에 직접 길게 작성하지 않습니다.
- 서버 주소는 환경 변수로 관리합니다.
- API 함수 이름은 동작이 드러나게 작성합니다.
- 비동기 코드는 `async/await`을 사용합니다.

예시:

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getArticles() {
  const response = await fetch(`${API_BASE_URL}/articles`);

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  return response.json();
}
```

## 상태 관리 규칙

- 한 컴포넌트 안에서만 쓰는 값은 `useState`를 사용합니다.
- 서버에서 가져오는 데이터는 TanStack Query 도입 후 query로 관리합니다.
- 여러 화면에서 공유해야 하는 값이 생기기 전까지 전역 상태를 만들지 않습니다.
- 상태 이름은 화면 의미가 드러나게 작성합니다.

좋은 예:

```tsx
const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
```

피해야 할 예:

```tsx
const [data, setData] = useState(null);
```

## 스타일 규칙

- Tailwind CSS를 기본 스타일 도구로 사용합니다.
- 같은 스타일 조합이 반복되면 컴포넌트로 분리합니다.
- 색상과 간격은 일관되게 사용합니다.
- 클릭 가능한 요소는 `button` 또는 `a`처럼 의미에 맞는 HTML 태그를 사용합니다.
- 모바일 화면에서 깨지지 않는지 확인합니다.

## 라우팅 규칙

- 페이지 단위 컴포넌트는 `pages` 폴더에 둡니다.
- 라우트 경로는 짧고 명확하게 작성합니다.

권장 경로:

```txt
/articles
/articles/:articleId
/notes
/daily
```

## 에러와 로딩 처리

서버 데이터를 불러오는 화면에는 아래 세 가지 상태를 고려합니다.

- 로딩 중
- 에러 발생
- 데이터 없음

데이터가 없을 때 빈 화면만 보여주지 않습니다.
사용자가 무엇을 보고 있는지 알 수 있는 문구를 표시합니다.

## 접근성 기본 규칙

- 버튼에는 클릭 동작이 명확한 텍스트를 넣습니다.
- 이미지를 사용할 경우 의미 있는 이미지에는 `alt`를 작성합니다.
- 링크는 실제 이동에만 사용하고, 버튼은 화면 안 동작에 사용합니다.
- 키보드로 이동해도 주요 기능을 사용할 수 있어야 합니다.

## 작업 순서

프론트엔드 기능은 아래 순서로 작게 구현합니다.

1. 필요한 타입을 정의합니다.
2. API 함수가 필요하면 `api` 폴더에 추가합니다.
3. 페이지 컴포넌트를 만듭니다.
4. 반복되는 UI를 컴포넌트로 분리합니다.
5. 로딩, 에러, 빈 상태를 추가합니다.
6. 모바일 화면을 확인합니다.
7. `npm run lint`와 `npm run build`를 실행합니다.

## 작업 전 체크리스트

- 이 작업이 하나의 작은 기능인가?
- 새 파일을 어디에 두어야 하는지 명확한가?
- 서버 주소나 비밀값을 하드코딩하지 않았는가?
- 이벤트 핸들러 이름이 `handle`로 시작하는가?
- `any` 없이 타입을 작성했는가?
- 로딩, 에러, 빈 상태가 필요한 화면인가?
- 같은 코드가 세 번 이상 반복되고 있지는 않은가?

## 커밋 전 확인

`client` 폴더에서 아래 명령어를 실행합니다.

```sh
npm run lint
npm run build
```

오류가 나면 메시지를 읽고, 가장 위에 나온 오류부터 해결합니다.
경고는 무시하기 전에 왜 발생했는지 확인합니다.
