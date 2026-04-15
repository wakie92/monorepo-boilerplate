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
