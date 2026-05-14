# 컴포넌트 단위 스트리밍 (RSC + Suspense + HydrationBoundary + ErrorBoundary)

페이지 단위 hydration(@architecture.md)으로 부족할 때만 사용한다.

## 언제 쓰나

- 한 페이지에 **독립적인 데이터 블록이 다수**이고, 가장 느린 쿼리가 다른 섹션의 TTFB을 막고 있을 때
- 섹션 하나가 실패해도 페이지 전체를 죽이지 말아야 할 때
- 같은 위젯이 **여러 페이지에서 재사용**되어 데이터 의존을 자기 자신이 들고 다녀야 할 때

해당 없으면 페이지 단위 패턴을 유지한다. 보일러플레이트가 늘어난다.

## 흐름

```
RSC page.tsx (셸)
  └─ <Suspense><ErrorBoundary>
       └─ SectionServer.tsx (async RSC)
            ├─ resolveSectionData (server-only)
            ├─ queryClient.prefetchQuery
            └─ <HydrationBoundary>
                 └─ SectionClient.tsx ("use client")
                      └─ useSectionPage → useSectionQuery
```

각 섹션은 자기 데이터를 자기가 prefetch한다. 페이지는 셸 조립만 한다.

## 디렉터리

```
features/{domain}/{feature}/
  server/SectionServer.tsx       # async RSC, prefetch + HydrationBoundary
  ui/SectionClient.tsx           # "use client", 렌더링
  shared/resolveSection.ts       # server-only 데이터 로드
  model/sectionQueryKey.ts       # directive 없는 파일
  model/useSectionQuery.ts       # "use client"
  hooks/useSectionPage.ts        # query + derived state
```

## page.tsx (셸)

```tsx
export default async function Page({ params }: PageProps) {
  const { orderNumber } = await params;

  return (
    <>
      <Suspense fallback={<OrderHeaderSkeleton />}>
        <ErrorBoundary fallback={<SectionError name="header" />}>
          <OrderHeaderSection orderNumber={orderNumber} />
        </ErrorBoundary>
      </Suspense>

      <Suspense fallback={<OrderTimelineSkeleton />}>
        <ErrorBoundary fallback={<SectionError name="timeline" />}>
          <OrderTimelineSection orderNumber={orderNumber} />
        </ErrorBoundary>
      </Suspense>
    </>
  );
}
```

페이지는 auth check / 라우팅만 책임지고, 데이터는 각 섹션이 소유한다.

## SectionServer.tsx

```tsx
import "server-only";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/getQueryClient";
import { orderHeaderQueryKey } from "../model/orderHeaderQueryKey";
import { resolveOrderHeader } from "../shared/resolveOrderHeader";
import { OrderHeaderClient } from "../ui/OrderHeaderClient";

export async function OrderHeaderSection({ orderNumber }: { orderNumber: string }) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: orderHeaderQueryKey(orderNumber),
    queryFn: () => resolveOrderHeader(orderNumber),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderHeaderClient orderNumber={orderNumber} />
    </HydrationBoundary>
  );
}
```

## ErrorBoundary

- **클라이언트 컴포넌트**여야 한다 (`"use client"`). `react-error-boundary` 사용.
- shell 레벨이 아닌 **섹션 외부**에 둔다. 안에 두면 섹션 자체가 throw할 때 잡지 못한다.
- fallback은 작은 메시지 + retry 버튼 정도. 페이지 navigation 트리거 금지.

```tsx
"use client";
import { ErrorBoundary } from "react-error-boundary";
// page.tsx에서 import해서 사용
```

## 주의사항

- `getQueryClient()`는 `cache()`로 요청-스코프 공유. 여러 섹션이 같은 인스턴스를 쓰면 `dehydrate` payload에 이전 섹션 키가 중복 포함될 수 있다. HydrationBoundary가 client에서 idempotent하게 merge하므로 동작은 문제 없지만, payload 최소화가 필요하면 섹션마다 `new QueryClient()`를 만든다.
- 페이지 단위 패턴과 **섞지 않는다**. 같은 페이지에서 page.tsx가 prefetch + 셸 안의 SectionServer가 또 prefetch하면 책임이 흐려진다. 한 페이지는 한 전략만.
- 같은 entity를 보여주는 섹션은 페이지 단위와 마찬가지로 **같은 queryKey**를 쓴다. mutation invalidate가 페이지 전체에서 동작한다.
- Suspense fallback은 **레이아웃 시프트가 없도록** 실제 콘텐츠와 같은 높이로 만든다. 그렇지 않으면 스트리밍이 오히려 UX를 해친다.
- 섹션 단위 streaming은 RSC 응답을 **flush** 받기 때문에 라우트가 `dynamic = "force-dynamic"`이거나 동적 데이터에 의존해야 의미가 있다. static 페이지는 효과 없다.

## 금지

- 셸 페이지에서 데이터 prefetch (셸은 데이터를 모른다)
- ErrorBoundary 내부에서 또 prefetch (catch 범위 밖)
- 한 페이지에서 페이지 단위 + 컴포넌트 단위 혼용
