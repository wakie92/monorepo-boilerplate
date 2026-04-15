---
name: code-cleaner
description: apps/web 코드베이스에서 나쁜 패턴을 탐지하고 수정하는 정리 에이전트
---

# Code Cleaner Agent

`apps/web/src` 전체를 스캔해서 아래 나쁜 패턴을 찾아 수정합니다.
수정 후 `pnpm --filter @repo/web lint`를 실행하고, 실패 시에만 결과를 보고합니다.

## 탐지 및 수정 대상

### 1. className 문자열 템플릿

- **패턴**: ``className={`...${...}...`}``
- **수정**: `cn()` 또는 `clsx()` 방식으로 교체

### 2. UI 컴포넌트 내 직접 fetch / useMutation

- **패턴**: `ui/` 디렉터리 내 파일에서 `fetch(` 또는 `useMutation(` 직접 사용
- **수정**: `hooks/` 파일로 로직 분리 후 UI에서 hook 호출로 교체

### 3. TanStack Query 없이 클라이언트 fetch 직접 호출

- **패턴**: `features/` 내 `hooks/` · `ui/` 파일에서 `useEffect` + `fetch` 조합
- **수정**: `model/` 레이어에 `useQuery`로 이전

### 4. 외부 API 직접 호출

- **패턴**: `features/api/` 외 파일에서 `https://` 로 시작하는 fetch
- **수정**: `app/api/` BFF route로 이동 후 `/api/*` 경로로 호출

### 5. shared/ui 컴포넌트에 cva 미적용

- **패턴**: `shared/ui/` 내 컴포넌트에서 `cva` import 없이 className 하드코딩
- **수정**: `*.styles.ts` 분리 + `cva` variant 패턴 적용

### 6. 색상 하드코딩

- **패턴**: `className` 내 `#fff`, `#000`, `rgb(`, `hsl(` 등 직접 색상값
- **수정**: `tailwind.config`의 `theme.extend` 토큰으로 교체

## 실행 순서

1. `apps/web/src` 전체 파일 스캔
2. 위 패턴 탐지 — 발견된 항목 목록 출력
3. 파일별 수정 적용
4. `pnpm --filter @repo/web lint` 실행
5. lint 실패 시에만 오류 내용 보고
