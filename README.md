# fe-monorepo

Next.js + Expo 모노레포 보일러플레이트 (Turborepo + pnpm workspace)

## 구조

```
fe-monorepo/
├── apps/
│   ├── web/          # Next.js 15 (App Router)
│   └── mobile/       # Expo (React Native, expo-router)
├── packages/
│   ├── db/           # Supabase 클라이언트 + pg + DB 타입
│   └── store/        # Zustand 공유 스토어
├── turbo.json
└── pnpm-workspace.yaml
```

## 기술 스택

| 영역 | 라이브러리 |
|------|-----------|
| 웹 | Next.js 15, Tailwind CSS, shadcn/ui, Framer Motion |
| 모바일 | Expo SDK 52, expo-router |
| 공통 | TypeScript, TanStack Query, Zustand, Supabase |
| DB | Supabase (PostgreSQL), pg |
| 빌드 | Turborepo, pnpm |

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

```bash
# 웹
cp apps/web/.env.local.example apps/web/.env.local

# 모바일
cp apps/mobile/.env.example apps/mobile/.env
```

각 파일에 Supabase 프로젝트 정보를 입력하세요.

### 3. DB 타입 생성 (Supabase)

```bash
npx supabase gen types typescript --project-id <project-id> > packages/db/src/types.ts
```

### 4. shadcn/ui 컴포넌트 추가

```bash
cd apps/web
pnpm dlx shadcn@latest add button
```

### 5. 개발 서버 실행

```bash
# 전체 실행
pnpm dev

# 웹만
pnpm dev --filter @repo/web

# 모바일만
pnpm dev --filter @repo/mobile
```

## 빌드

```bash
pnpm build
```
