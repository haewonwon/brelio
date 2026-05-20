# API Spec

이 문서는 Brelio의 REST API 명세입니다.
Swagger는 아직 도입하지 않고, Markdown 문서로 관리합니다.

## Base URL

로컬 개발 환경 기준:

```txt
http://localhost:4000
```

모든 API 경로는 Base URL 뒤에 붙여서 호출합니다.

## Common Response Shape

성공 응답:

```json
{
  "success": true,
  "data": {}
}
```

실패 응답:

```json
{
  "success": false,
  "error": {
    "message": "Error message"
  }
}
```

## Authentication

Brelio는 Google OAuth idToken을 백엔드에서 검증한 뒤 자체 JWT accessToken을 발급합니다.

보호 API를 호출할 때는 아래 헤더를 포함합니다.

```http
Authorization: Bearer <accessToken>
```

인증 토큰이 없거나 유효하지 않으면 `401 Unauthorized`를 반환합니다.

```json
{
  "success": false,
  "error": {
    "message": "Authorization token is required"
  }
}
```

## API Access

### Public APIs

- `POST /api/auth/google`
- `GET /api/articles`
- `GET /api/articles/:id`
- `POST /api/crawling/articles`

### Protected APIs

- `GET /api/articles/:articleId/note`
- `POST /api/articles/:articleId/note`
- `PATCH /api/notes/:noteId`
- `DELETE /api/notes/:noteId`
- `GET /api/daily-logs`
- `GET /api/daily-logs/today`
- `GET /api/daily-logs/streak`

## Objects

### User Object

| Field | Type | Nullable | Description |
| --- | --- | --- | --- |
| `id` | `string` | No | 사용자 ID |
| `email` | `string` | No | 사용자 이메일 |
| `name` | `string` | Yes | 사용자 이름 |
| `profileImageUrl` | `string` | Yes | Google 프로필 이미지 URL |

### Article Object

| Field | Type | Nullable | Description |
| --- | --- | --- | --- |
| `id` | `string` | No | 기사 ID |
| `title` | `string` | No | 기사 제목 |
| `source` | `string` | Yes | 기사 출처 |
| `summary` | `string` | Yes | 기사 요약 |
| `url` | `string` | No | 원문 기사 URL |
| `publishedAt` | `string` | Yes | 기사 발행 시각, ISO 8601 형식 |
| `createdAt` | `string` | No | 데이터 생성 시각, ISO 8601 형식 |

### Note Object

| Field | Type | Nullable | Description |
| --- | --- | --- | --- |
| `id` | `string` | No | 노트 ID |
| `articleId` | `string` | No | 기사 ID |
| `content` | `string` | No | 사용자가 작성한 생각 |
| `createdAt` | `string` | No | 생성 시각, ISO 8601 형식 |
| `updatedAt` | `string` | No | 수정 시각, ISO 8601 형식 |

### DailyLog Object

| Field | Type | Nullable | Description |
| --- | --- | --- | --- |
| `id` | `string` | No | 데일리 로그 ID |
| `date` | `string` | No | 날짜, ISO 8601 형식 |
| `completed` | `boolean` | No | 완료 여부 |
| `completedAt` | `string` | Yes | 완료 시각, ISO 8601 형식 |
| `createdAt` | `string` | No | 생성 시각, ISO 8601 형식 |
| `updatedAt` | `string` | No | 수정 시각, ISO 8601 형식 |

## POST /api/auth/google

Google idToken을 검증하고 Brelio accessToken을 발급합니다.

### Request

```http
POST /api/auth/google
Content-Type: application/json
```

```json
{
  "idToken": "google-id-token"
}
```

### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": "clx123user",
      "email": "user@example.com",
      "name": "User Name",
      "profileImageUrl": "https://example.com/profile.png"
    }
  }
}
```

### Failure Response

Status: `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "message": "Invalid request"
  }
}
```

Status: `401 Unauthorized`

```json
{
  "success": false,
  "error": {
    "message": "Invalid Google idToken"
  }
}
```

Status: `500 Internal Server Error`

```json
{
  "success": false,
  "error": {
    "message": "Internal server error"
  }
}
```

## GET /api/articles

기사 목록을 조회합니다.

### Request

```http
GET /api/articles
```

### Query Parameters

현재 지원하지 않습니다.
Pagination, search, filter는 아직 구현하지 않습니다.

### Success Response

Status: `200 OK`

최신 기사 순으로 반환합니다.
`publishedAt`이 있는 기사는 `publishedAt` 기준 최신순으로 먼저 반환하고, `publishedAt`이 없는 기사는 뒤에 `createdAt` 기준 최신순으로 반환합니다.

```json
{
  "success": true,
  "data": [
    {
      "id": "clx123article",
      "title": "Federal Reserve Signals Caution on Future Rate Cuts",
      "source": "Global Economy Daily",
      "summary": "The Federal Reserve said it will continue watching inflation and labor market data before making additional rate decisions.",
      "url": "https://example.com/economy/fed-rate-cuts-caution",
      "publishedAt": "2026-05-18T09:00:00.000Z",
      "createdAt": "2026-05-19T01:00:00.000Z"
    }
  ]
}
```

### Empty Response

Status: `200 OK`

```json
{
  "success": true,
  "data": []
}
```

## GET /api/articles/:id

기사 ID로 기사 상세 정보를 조회합니다.

### Request

```http
GET /api/articles/:id
```

### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | 조회할 기사 ID |

### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clx123article",
    "title": "Federal Reserve Signals Caution on Future Rate Cuts",
    "source": "Global Economy Daily",
    "summary": "The Federal Reserve said it will continue watching inflation and labor market data before making additional rate decisions.",
    "url": "https://example.com/economy/fed-rate-cuts-caution",
    "publishedAt": "2026-05-18T09:00:00.000Z",
    "createdAt": "2026-05-19T01:00:00.000Z"
  }
}
```

### Failure Response

Status: `404 Not Found`

```json
{
  "success": false,
  "error": {
    "message": "Article not found"
  }
}
```

## GET /api/articles/:articleId/note

로그인한 사용자의 기사별 노트를 조회합니다.

### Request

```http
GET /api/articles/:articleId/note
Authorization: Bearer <accessToken>
```

### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clx123note",
    "articleId": "clx123article",
    "content": "금리 전망을 더 찾아봐야겠다.",
    "createdAt": "2026-05-19T01:00:00.000Z",
    "updatedAt": "2026-05-19T01:10:00.000Z"
  }
}
```

### Failure Response

Status: `401 Unauthorized`

```json
{
  "success": false,
  "error": {
    "message": "Authorization token is required"
  }
}
```

Status: `404 Not Found`

```json
{
  "success": false,
  "error": {
    "message": "Note not found"
  }
}
```

## POST /api/articles/:articleId/note

로그인한 사용자의 기사별 노트를 생성하거나 수정합니다.
같은 사용자와 기사 조합의 노트가 이미 있으면 upsert 처리합니다.

### Request

```http
POST /api/articles/:articleId/note
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "content": "오늘 기사에서 환율 흐름이 중요해 보였다."
}
```

### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clx123note",
    "articleId": "clx123article",
    "content": "오늘 기사에서 환율 흐름이 중요해 보였다.",
    "createdAt": "2026-05-19T01:00:00.000Z",
    "updatedAt": "2026-05-19T01:00:00.000Z"
  }
}
```

### Failure Response

Status: `401 Unauthorized`

```json
{
  "success": false,
  "error": {
    "message": "Authorization token is required"
  }
}
```

Status: `404 Not Found`

```json
{
  "success": false,
  "error": {
    "message": "Article not found"
  }
}
```

## PATCH /api/notes/:noteId

로그인한 사용자의 노트를 수정합니다.

### Request

```http
PATCH /api/notes/:noteId
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "content": "수정한 노트 내용"
}
```

### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clx123note",
    "articleId": "clx123article",
    "content": "수정한 노트 내용",
    "createdAt": "2026-05-19T01:00:00.000Z",
    "updatedAt": "2026-05-19T01:20:00.000Z"
  }
}
```

### Failure Response

Status: `401 Unauthorized`

```json
{
  "success": false,
  "error": {
    "message": "Authorization token is required"
  }
}
```

Status: `404 Not Found`

```json
{
  "success": false,
  "error": {
    "message": "Note not found"
  }
}
```

## DELETE /api/notes/:noteId

로그인한 사용자의 노트를 삭제합니다.

### Request

```http
DELETE /api/notes/:noteId
Authorization: Bearer <accessToken>
```

### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

### Failure Response

Status: `401 Unauthorized`

```json
{
  "success": false,
  "error": {
    "message": "Authorization token is required"
  }
}
```

Status: `404 Not Found`

```json
{
  "success": false,
  "error": {
    "message": "Note not found"
  }
}
```

## GET /api/daily-logs

로그인한 사용자의 데일리 로그 목록을 최신 날짜 순으로 조회합니다.

### Request

```http
GET /api/daily-logs
Authorization: Bearer <accessToken>
```

### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "clx123dailylog",
      "date": "2026-05-19T00:00:00.000Z",
      "completed": true,
      "completedAt": "2026-05-19T01:20:00.000Z",
      "createdAt": "2026-05-19T01:20:00.000Z",
      "updatedAt": "2026-05-19T01:20:00.000Z"
    }
  ]
}
```

### Failure Response

Status: `401 Unauthorized`

```json
{
  "success": false,
  "error": {
    "message": "Authorization token is required"
  }
}
```

## GET /api/daily-logs/today

로그인한 사용자의 오늘 완료 여부를 조회합니다.

### Request

```http
GET /api/daily-logs/today
Authorization: Bearer <accessToken>
```

### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "data": {
    "date": "2026-05-19T00:00:00.000Z",
    "completed": true,
    "completedAt": "2026-05-19T01:20:00.000Z"
  }
}
```

### Failure Response

Status: `401 Unauthorized`

```json
{
  "success": false,
  "error": {
    "message": "Authorization token is required"
  }
}
```

## GET /api/daily-logs/streak

로그인한 사용자의 현재 연속 완료일 수를 조회합니다.

### Request

```http
GET /api/daily-logs/streak
Authorization: Bearer <accessToken>
```

### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "data": {
    "streak": 3
  }
}
```

### Failure Response

Status: `401 Unauthorized`

```json
{
  "success": false,
  "error": {
    "message": "Authorization token is required"
  }
}
```

## POST /api/crawling/articles

외부 경제 뉴스 페이지를 수동으로 크롤링해 Article 테이블에 저장합니다.
중복 기사는 `url` 기준으로 건너뜁니다.

### Request

```http
POST /api/crawling/articles
```

### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "data": {
    "totalCount": 10,
    "savedCount": 7,
    "skippedCount": 3
  }
}
```

### Failure Response

Status: `500 Internal Server Error`

```json
{
  "success": false,
  "error": {
    "message": "Failed to crawl articles"
  }
}
```

## Not Implemented Yet

아래 기능은 아직 구현하지 않습니다.

- Frontend auth flow
- 자동 크롤링 스케줄링
- 페이지네이션
- 검색
- 필터
