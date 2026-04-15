# 앱 아키텍처 (apps/web)

## 디렉터리

```
src/
  app/
    api/{domain}/route.ts     # BFF — 외부 API·DB는 여기서만 호출
    (group)/page.tsx          # Server Component, 화면 조립만
  shared/
    ui/                       # 재사용 컴포넌트
    lib/utils.ts              # cn() 유틸
  features/{domain}/{feature}/
    ui/          # 렌더링 전용 Client Component + *.styles.ts
    hooks/       # UI 로직·상태 (model 조합)
    model/       # TanStack Query (useQuery / useMutation)
    api/         # /api/* fetch 함수
```

## 데이터 흐름

```
UI → hooks → model → api → /app/api (BFF) → 외부 API
```

## 레이어 책임

| 레이어     | 역할                                    |
| ---------- | --------------------------------------- |
| `ui/`      | props 받아 렌더링만. 로직·fetch 금지    |
| `hooks/`   | UI 상태·이벤트 처리. model 조합         |
| `model/`   | TanStack Query. 서버 상태 관리          |
| `api/`     | `/api/*` 호출 함수. 외부 직접 호출 금지 |
| `app/api/` | 외부 API·DB 접근. 서버 전용             |

## 상태 관리

| 상태         | 위치                      |
| ------------ | ------------------------- |
| 서버 상태    | TanStack Query (`model/`) |
| UI 로컬 상태 | `hooks/` 내 `useState`    |
| 전역 상태    | `@repo/store` (Zustand)   |

## API 호출 규칙

- 클라이언트 API 호출은 **TanStack Query(`useQuery` / `useMutation`)를 기본으로 사용**합니다.
- `fetch`를 직접 호출하는 것은 Server Component, 단순 one-off 액션 등 특별한 경우에만 허용합니다.

## 금지

- 클라이언트에서 외부 API 직접 호출
- UI에 fetch / mutation / 비즈니스 로직 작성
- hooks 없이 UI에서 model 직접 참조
- Server Component에서 hooks 사용
- TanStack Query 없이 클라이언트에서 `fetch` 직접 호출
