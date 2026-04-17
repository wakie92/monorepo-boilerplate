# fe-monorepo

Next.js + Expo 기반 풀스택 모노레포 (Turborepo + pnpm workspace)

## 패키지 구조

```
apps/
  web/        # Next.js 15 (App Router)
  mobile/     # Expo / React Native

packages/
  db/               # Supabase 타입·클라이언트
  store/            # Zustand 전역 스토어
  tsconfig/         # 공유 TypeScript 설정
  eslint-config/    # 공유 ESLint flat 설정
  prettier-config/  # 공유 Prettier 설정
```

## 요구사항

- Node.js `>=20`
- pnpm `>=9`

## 시작하기

```bash
pnpm install
pnpm dev
```

특정 앱만 실행:

```bash
pnpm --filter @repo/web dev
pnpm --filter @repo/mobile dev
```

## 주요 명령

| 명령              | 설명                           |
| ----------------- | ------------------------------ |
| `pnpm dev`        | 전체 개발 서버                 |
| `pnpm build`      | 전체 빌드                      |
| `pnpm lint`       | ESLint 검사                    |
| `pnpm type-check` | TypeScript 검사                |
| `pnpm format`     | Prettier 포맷                  |
| `pnpm clean`      | 빌드 캐시 및 node_modules 제거 |

## 기술 스택

| 영역        | 기술                                                         |
| ----------- | ------------------------------------------------------------ |
| Web         | Next.js 15, React 19, TanStack Query, Zustand, Framer Motion |
| Mobile      | Expo SDK, React Native                                       |
| 스타일      | Tailwind CSS, cva, clsx, tailwind-merge                      |
| DB          | Supabase (PostgreSQL)                                        |
| 패키지 관리 | pnpm, Turborepo                                              |
| 코드 품질   | ESLint, Prettier, Husky, commitlint                          |

## 앱 아키텍처 (apps/web)

### 디렉터리 구조

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

### 데이터 흐름

```
UI → hooks → model → api → /app/api (BFF) → 외부 API
```

### 레이어 책임

| 레이어     | 역할                                    |
| ---------- | --------------------------------------- |
| `ui/`      | props 받아 렌더링만. 로직·fetch 금지    |
| `hooks/`   | UI 상태·이벤트 처리. model 조합         |
| `model/`   | TanStack Query. 서버 상태 관리          |
| `api/`     | `/api/*` 호출 함수. 외부 직접 호출 금지 |
| `app/api/` | 외부 API·DB 접근. 서버 전용             |

### 상태 관리

| 상태         | 위치                      |
| ------------ | ------------------------- |
| 서버 상태    | TanStack Query (`model/`) |
| UI 로컬 상태 | `hooks/` 내 `useState`    |
| 전역 상태    | `@repo/store` (Zustand)   |

## UI & 스타일 (Tailwind + clsx + cva)

### 원칙

- 스타일은 **`*.styles.ts`에 분리**. 컴포넌트에서 import해서 사용.
- className은 **`cn()`** 사용 (`@/shared/lib/utils`). 문자열 템플릿 금지.
- `shared/ui`: **cva variant 패턴 필수** + `defaultVariants` 명시.
- `features/ui`: `clsx` 직접 사용 가능. 2회 이상 반복 시 `shared/ui`로 이동.
- 색상 등 디자인 토큰은 `tailwind.config`의 `theme.extend`에서 관리. 하드코딩 금지.

```tsx
// ❌ <div className={`px-4 ${isActive ? "bg-blue-500" : ""}`} />
// ✅ <div className={cn("px-4", isActive && "bg-primary")} />
```

### 컴포넌트 책임

| 위치               | 역할                             |
| ------------------ | -------------------------------- |
| `shared/ui`        | 재사용 UI + cva 스타일           |
| `features/*/ui`    | 렌더링 전용, hooks에서 로직 수신 |
| `features/*/hooks` | UI 상태·이벤트 처리              |
| `app/**/page.tsx`  | 화면 구성 (Server Component)     |

## 환경 변수

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Supabase 프로젝트 정보를 입력하세요.

## DB 타입 생성

```bash
npx supabase gen types typescript --project-id <project-id> > packages/db/src/types.ts
```

## 커밋 규칙

[Conventional Commits](https://www.conventionalcommits.org/) 기반. 형식: `<type>(<scope>): <subject>`

```
feat(web): Add password reset flow
fix(store): Resolve hydration mismatch
chore(deps): Upgrade TanStack Query to v5
```
