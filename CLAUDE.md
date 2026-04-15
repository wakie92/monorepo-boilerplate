# fe-monorepo — Claude 안내

이 파일은 Claude Code / Claude가 이 저장소에서 작업할 때 참고하는 프로젝트 컨텍스트입니다.

## 개요

- **패키지 매니저**: `pnpm@9` (`packageManager` 필드 기준)
- **모노레포**: Turborepo + pnpm workspace
- **Node**: `>=20`

## 디렉터리

| 경로                       | 설명                                          |
| -------------------------- | --------------------------------------------- |
| `apps/web`                 | Next.js 15 (`@repo/web`)                      |
| `apps/mobile`              | Expo / React Native (`@repo/mobile`)          |
| `packages/db`              | DB·Supabase 타입·클라이언트 (`@repo/db`)      |
| `packages/store`           | Zustand 스토어 (`@repo/store`)                |
| `packages/tsconfig`        | 공유 `tsconfig` (`@repo/tsconfig`)            |
| `packages/eslint-config`   | 공유 ESLint flat 설정 (`@repo/eslint-config`) |
| `packages/prettier-config` | Prettier 설정 (`@repo/prettier-config`)       |

앱은 `@repo/*` 워크스페이스 패키지를 `workspace:*`로 참조합니다.

## 자주 쓰는 명령 (루트에서)

```bash
pnpm install          # 의존성 설치
pnpm dev              # turbo run dev (여러 앱 동시에 켤 수 있음)
pnpm build            # 전체 빌드
pnpm lint             # 전체 ESLint
pnpm type-check       # 전체 TypeScript 검사
pnpm format           # Prettier 작성
pnpm format:check     # Prettier 검사만
```

커밋 시 Husky + **lint-staged**가 돌며, ESLint는 루트가 아니라 경로별 설정(`apps/web`, `apps/mobile`, `eslint.config.packages.mjs`)을 `--config`로 지정합니다.

특정 앱만:

```bash
pnpm --filter @repo/web dev
pnpm --filter @repo/mobile dev
```

## TypeScript

- 공통 옵션: `packages/tsconfig/base.json`
- Next: `@repo/tsconfig/nextjs.json` (`moduleResolution: bundler` 등)
- 라이브러리 패키지: `@repo/tsconfig/library.json` (`NodeNext` 계열과 정렬)
- 루트 `tsconfig.json`은 `repo.d.ts`만 포함하고, 앱/패키지 타입체크는 **각 패키지**의 `tsc`로 수행합니다.

## ESLint / Prettier

- ESLint: `@repo/eslint-config` (`base`, `next`, `react-native` export)
- Prettier: `prettier` 필드로 `@repo/prettier-config` 연결
- Web은 `eslint.config.mjs` + FlatCompat + `next/core-web-vitals` 조합

## 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/) + **commitlint** (`commitlint.config.js`, Husky `commit-msg` 훅).

### 형식

```
<type>(<optional-scope>): <subject>

[optional body]

[optional footer(s)]
```

- **type**(필수): 아래 목록만 사용합니다.  
  `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `revert`
- **scope**(선택): 영향 범위를 짧게. 예: `web`, `mobile`, `db`, `store`, `eslint-config`, `deps`
- **subject**(필수): 명령형·한 줄로 요약. **최대 72자**.  
  프로젝트 규칙상 **`sentence-case`**(문장처럼 첫 글자 대문자)를 씁니다.  
  예: `feat(web): Add password reset flow` / `fix: Resolve store hydration mismatch`
- **body**(선택): 줄당 **최대 100자**로 줄바꿈합니다. 무엇을·왜 바꿨는지 보조 설명.
- **footer**(선택): 이슈 번호(`Closes #123`), `BREAKING CHANGE:` 등 필요 시.

### 좋은 예 / 피할 것

- 좋음: `feat(web): Add session refresh on focus` — 타입·범위·요약이 분명함
- 피함: `update`, `WIP`, `fix bug` — type 없음 또는 규칙 미준수
- 한 커밋에 서로 무관한 변경을 섞지 말고, 필요하면 커밋을 나눕니다.

## 변경 시 지침

1. **범위**: 요청한 작업에 필요한 파일만 수정하고, 무관한 리팩터는 하지 않습니다.
2. **워크스페이스**: 새 공유 코드는 `packages/*`에 두고, 앱에서는 `@repo/...`로 가져옵니다.
3. **검증**: 변경 후 가능하면 `pnpm type-check`와 해당 앱의 `pnpm lint`를 맞춥니다.
4. **환경 변수**: `.env`는 커밋하지 않습니다. 필요한 키는 `.env.example` 등 문서로만 안내합니다.

## Claude Code (전용 설정)

- **프로젝트 공통**: `.claude/settings.json` — 팀과 공유되는 권한·옵션(JSON Schema 자동완성용 `$schema` 포함).
- **개인만**: `.claude/settings.local.json` — 이 저장소에서만 쓰는 오버라이드(저장소 `.gitignore`에 포함됨).
- **에이전트**: 필요 시 `.claude/agents/`에 서브에이전트 정의를 추가합니다. ([문서](https://docs.claude.com/en/docs/claude-code/settings))

## Cursor와의 관계

- 세부 규칙·파일별 가이드는 `.cursor/rules/*.mdc`에 두는 것을 권장합니다.
- 커밋 메시지 규칙은 `.cursor/rules/commit-convention.mdc`에도 요약해 두었습니다(`alwaysApply: true`).
- 이 `CLAUDE.md`는 Claude 계열이 저장소 루트에서 자동으로 읽는 용도입니다.
