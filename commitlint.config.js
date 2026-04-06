/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",     // 새 기능
        "fix",      // 버그 수정
        "docs",     // 문서
        "style",    // 포맷, 세미콜론 등 (로직 변경 없음)
        "refactor", // 리팩토링
        "test",     // 테스트
        "chore",    // 빌드, 패키지 설정 등
        "perf",     // 성능 개선
        "ci",       // CI 설정
        "revert",   // 커밋 되돌리기
      ],
    ],
    "subject-case": [2, "always", "sentence-case"],
    "subject-max-length": [2, "always", 72],
    "body-max-line-length": [2, "always", 100],
  },
};

module.exports = config;
