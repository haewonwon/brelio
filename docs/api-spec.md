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

## Article Object

Article API는 아래 필드를 반환합니다.

| Field | Type | Nullable | Description |
| --- | --- | --- | --- |
| `id` | `string` | No | 기사 ID |
| `title` | `string` | No | 기사 제목 |
| `source` | `string` | Yes | 기사 출처 |
| `summary` | `string` | Yes | 기사 요약 |
| `url` | `string` | No | 원문 기사 URL |
| `publishedAt` | `string` | Yes | 기사 발행 시각, ISO 8601 형식 |
| `createdAt` | `string` | No | 데이터 생성 시각, ISO 8601 형식 |

예시:

```json
{
  "id": "clx123article",
  "title": "Federal Reserve Signals Caution on Future Rate Cuts",
  "source": "Global Economy Daily",
  "summary": "The Federal Reserve said it will continue watching inflation and labor market data before making additional rate decisions.",
  "url": "https://example.com/economy/fed-rate-cuts-caution",
  "publishedAt": "2026-05-18T09:00:00.000Z",
  "createdAt": "2026-05-19T01:00:00.000Z"
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
    },
    {
      "id": "clx456article",
      "title": "Oil Prices Rise as Supply Concerns Return",
      "source": "Market Brief",
      "summary": "Crude oil prices moved higher after traders reacted to renewed supply concerns and stronger seasonal demand expectations.",
      "url": "https://example.com/economy/oil-prices-supply-concerns",
      "publishedAt": "2026-05-17T11:30:00.000Z",
      "createdAt": "2026-05-19T01:00:00.000Z"
    }
  ]
}
```

### Empty Response

Status: `200 OK`

기사가 없어도 실패가 아니라 빈 배열을 반환합니다.

```json
{
  "success": true,
  "data": []
}
```

### Failure Response

Status: `500 Internal Server Error`

```json
{
  "success": false,
  "error": {
    "message": "Failed to fetch articles"
  }
}
```

## GET /api/articles/:id

기사 ID로 기사 상세 정보를 조회합니다.

### Request

```http
GET /api/articles/:id
```

예시:

```http
GET /api/articles/clx123article
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

해당 ID의 기사가 없을 때 반환합니다.

```json
{
  "success": false,
  "error": {
    "message": "Article not found"
  }
}
```

Status: `500 Internal Server Error`

```json
{
  "success": false,
  "error": {
    "message": "Failed to fetch article"
  }
}
```

## Not Implemented Yet

아래 기능은 아직 구현하지 않습니다.

- 인증
- 크롤링
- 페이지네이션
- 검색
- 필터
- 메모 API
- 데일리 트래킹 API
