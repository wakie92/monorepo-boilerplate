# UI & 스타일 (Tailwind + clsx + cva)

## 원칙

- 스타일은 **`*.styles.ts`에 분리**. 컴포넌트에서 import해서 사용.
- className은 **`cn()`** 사용 (`@/shared/lib/utils`). 문자열 템플릿 금지.
- `shared/ui`: **cva variant 패턴 필수** + `defaultVariants` 명시.
- `features/ui`: `clsx` 직접 사용 가능. 2회 이상 반복 시 `shared/ui`로 이동.
- 색상 등 디자인 토큰은 `tailwind.config`의 `theme.extend`에서 관리. 하드코딩 금지.

```tsx
// ❌ <div className={`px-4 ${isActive ? "bg-blue-500" : ""}`} />
// ✅ <div className={cn("px-4", isActive && "bg-primary")} />
```

## 파일 구조

```
shared/ui/{component}/
  Component.tsx
  component.styles.ts

features/{domain}/{feature}/
  ui/
    Component.tsx
    component.styles.ts
  hooks/
    useComponent.ts
```

## 컴포넌트 책임

| 위치               | 역할                             |
| ------------------ | -------------------------------- |
| `shared/ui`        | 재사용 UI + cva 스타일           |
| `features/*/ui`    | 렌더링 전용, hooks에서 로직 수신 |
| `features/*/hooks` | UI 상태·이벤트 처리              |
| `app/**/page.tsx`  | 화면 구성 (Server Component)     |
