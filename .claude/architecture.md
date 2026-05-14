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

## SSR + TanStack Query (Hydration)

서버에서 prefetch → 같은 cache로 hydrate → mutation invalidate로 자동 refetch.

### 흐름

```
RSC page → resolveXxxData (server-only) → queryClient.setQueryData → HydrationBoundary
  → ClientPage → useXxxPage → useXxxQuery → fetchXxx → /api/{domain} → Supabase
```

### 구성 파일

| 파일                                    | 역할                                                              |
| --------------------------------------- | ----------------------------------------------------------------- |
| `lib/getQueryClient.ts`                 | `cache()`로 감싼 요청-스코프 QueryClient (`server-only`)          |
| `features/.../shared/resolveXxxData.ts` | `server-only`. supabase·외부 fetch 등 SSR 로직                    |
| `features/.../api/fetchXxx.ts`          | `/api/{domain}` BFF 호출                                          |
| `features/.../model/xxxQueryKey.ts`     | queryKey factory. **directive 없는 별도 파일** (RSC/Client 양쪽)  |
| `features/.../model/useXxxQuery.ts`     | `"use client"`. `useQuery({ queryKey, queryFn })`                 |
| `features/.../hooks/useXxxPage.ts`      | query + derived state. UI는 이 hook만 사용                        |

### page.tsx

```tsx
const result = await resolveOrderDetailData({ supabase, userId, orderNumber });
if (result.kind === "not_found") notFound();

const queryClient = getQueryClient();
queryClient.setQueryData(orderDetailQueryKey(orderNumber), result.data.order);

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <OrderDetailDashboardPage
      orderNumber={orderNumber}
      ogImages={result.data.ogImages} // 정적·서버 전용 데이터는 props
    />
  </HydrationBoundary>
);
```

### 에러·로딩 처리

페이지 단위는 Next.js 라우트 컨벤션(`loading.tsx` / `error.tsx`)을 사용한다. 별도 `<Suspense>` · `<ErrorBoundary>`를 page.tsx 안에 쓰지 않는다 — 중첩되면 책임이 흐려진다.

```
app/(group)/order/[orderNumber]/
  page.tsx        # RSC 데이터 resolve + HydrationBoundary
  loading.tsx     # RSC resolve 중 표시 (스켈레톤)
  error.tsx       # "use client". 페이지 throw 시 fallback + reset()
```

```tsx
// loading.tsx
import { OrderDetailSkeleton } from "@/features/order/detail/ui/OrderDetailSkeleton";
export default function Loading() {
  return <OrderDetailSkeleton />;
}
```

```tsx
// error.tsx
"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <OrderDetailErrorFallback onRetry={reset} />;
}
```

- 스켈레톤은 `features/.../ui/XxxSkeleton.tsx`에 두고 페이지·loading.tsx 양쪽에서 import.
- 스켈레톤은 실제 콘텐츠와 **같은 높이·구조**로. 레이아웃 시프트 방지.
- `useQuery`는 hydration으로 데이터가 이미 있으므로 첫 렌더에서 Suspense fallback이 뜨지 않는다. 클라이언트 refetch 중 로딩 표시가 필요하면 hook 안에서 `isFetching` 기반으로 처리.

### Mutation

같은 `queryKey`를 invalidate. `router.refresh` 불필요.

```tsx
return useMutation({
  mutationFn: () => requestShipping(orderNumber),
  onSuccess: () => {
    void queryClient.invalidateQueries({ queryKey: orderDetailQueryKey(orderNumber) });
  },
});
```

### 규칙

- 같은 entity를 보여주는 화면은 **같은 queryKey** 사용 (한쪽 mutation이 다른 쪽도 invalidate).
- mutation으로 변하지 않는 / 외부 fetch가 필요한 / 서버 전용 데이터는 cache에 넣지 말고 **props로 전달**.
- queryKey factory는 directive 없는 모듈에 둔다. `"use client"` 파일에 두면 RSC에서 import 불가.

<!-- ### 컴포넌트 단위 스트리밍 (필요시 사용)

페이지 안에 독립적인 데이터 블록이 다수이고 섹션별 스트리밍·에러 격리가 필요한 경우에만 사용한다. 자세한 패턴은 @.claude/streaming-sections.md. -->
