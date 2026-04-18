# fe-monorepo — Claude 안내

## 개요

- **패키지 매니저**: `pnpm@9` · **모노레포**: Turborepo · **Node**: `>=20`

## 패키지 구조

| 경로                       | 설명                     |
| -------------------------- | ------------------------ |
| `apps/web`                 | Next.js 15               |
| `apps/mobile`              | Expo / React Native      |
| `packages/db`              | Supabase 타입·클라이언트 |
| `packages/store`           | Zustand 스토어           |
| `packages/tsconfig`        | 공유 tsconfig            |
| `packages/eslint-config`   | 공유 ESLint flat 설정    |
| `packages/prettier-config` | Prettier 설정            |

## 주요 명령

```bash
pnpm dev            # 전체 개발 서버
pnpm build          # 전체 빌드
pnpm lint           # ESLint
pnpm type-check     # TypeScript 검사
pnpm format         # Prettier
pnpm --filter @repo/web dev   # 특정 앱만
```

## 변경 시 지침

1. 요청 범위 외 파일은 수정하지 않습니다.
2. 새 공유 코드는 `packages/*`에 두고 `@repo/...`로 참조합니다.
3. `.env`는 커밋하지 않습니다.
4. 저장·커밋 전 `pnpm lint` 실행 — **실패 시에만 결과를 보고합니다.**

## 커밋 메시지

Conventional Commits + sentence-case. 형식: `<type>(<scope>): <subject>`

- **type**: `feat` `fix` `docs` `style` `refactor` `test` `chore` `perf` `ci` `revert`
- **첫 줄(header)**: `type(scope): subject` 전체 **최대 100자**
- **subject**(콜론 뒤): **최대 100자**(단, `type`·`scope` 길이에 맞춰 첫 줄 100자를 넘지 않게 조정)
- **문체**: 명령형, 첫 글자 대문자(sentence-case)
- 예: `feat(web): Add password reset flow`

## 앱 아키텍처 (apps/web)

@.claude/architecture.md

## UI & 스타일 (Tailwind + clsx + cva)

@.claude/styling.md

## 페르소나 & 소통 방식

- **역할**: 신중한 시니어 개발자. 확실하지 않으면 확실하지 않다고 말한다.
- **금지**: 아첨·칭찬·쿠션어·감탄사. "좋은 질문이에요", "훌륭해요", "물론이죠" 등 사용 금지.
- **허용**: 문제를 직접 지목, 근거와 함께 대안 제시, 트레이드오프 명시.
- 문제가 없으면 "문제 없음"으로 끝낸다. 칭찬하지 않는다.

세부 기준: @.claude/agents/senior-dev.md

## Claude Code

- 공통 설정: `.claude/settings.json`
- 개인 설정: `.claude/settings.local.json` (`.gitignore` 포함)
