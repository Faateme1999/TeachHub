# TeachHub — Frontend (React + Vite)

The single-page app (SPA) for TeachHub. Users register/log in, browse and create
courses, add lessons, enroll, and view profiles.

Tech: **React 19**, **TypeScript**, **Vite**, **React Router**, **TanStack Query**
(server data + caching), **axios** (HTTP), plain **CSS** with CSS-variable theming
(light + dark). Package manager: **pnpm**. Linter: **oxlint**.

---

## 1. Run it

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints (default **http://localhost:5173**).

> ⚠️ The **backend must be running on http://localhost:3000** for data to load.
> See `../backend/README.md`. The dev server proxies every `/api/...` request to
> the backend (see `vite.config.ts`), so you don't need to worry about CORS.

Other commands:

```bash
pnpm build     # type-check + production build into dist/
pnpm preview   # preview the production build
pnpm lint      # run oxlint
```

---

## 2. How the code is organized

```
src/
  main.tsx            App entry — sets up React Query, Router, Toasts, Auth.
  App.tsx             The route table (which URL shows which page).
  index.css           Design system: colors, spacing, light/dark theme.

  lib/                Non-UI helpers
    apiClient.ts      One axios instance. Adds the auth token, handles 401s.
    queryKeys.ts      Names used to cache/refresh data with React Query.
    format.ts         Small helpers (price, date, initials).

  types/
    api.ts            TypeScript shapes of backend data (User, Course, Lesson).

  context/            App-wide state
    auth-context.ts   The auth context + useAuth() hook.
    AuthProvider.tsx  Holds who's logged in; login/register/logout.

  hooks/              Data hooks (built on React Query)
    useCourses.ts     List/detail/create/update/delete/enroll.
    useLessons.ts     Lessons for a course + create/update/delete.
    useUsers.ts       Users list, profiles, my profile, my courses.

  components/
    ui/               Reusable building blocks: Button, Input, Card, Modal,
                      ConfirmDialog, Spinner, Badge, Toast, empty/error states.
    layout/           Navbar, Layout (page frame), footer.
    ProtectedRoute    Redirects to /login if you're not signed in.
    PublicOnlyRoute   Redirects logged-in users away from login/register.
    CourseCard, CourseForm, LessonForm

  pages/              One file per screen (Courses, CourseDetail, Login, ...).
```

### Beginner concepts used here

- **React Router** maps URLs to pages. `<Link>` navigates without reloading.
- **TanStack Query** (`useQuery` / `useMutation`) fetches data and caches it, and
  gives you `isLoading` / `isError` for free. After changing data we
  "invalidate" a query key so the screen refreshes.
- **Context** (`AuthProvider`) shares the logged-in user with every component.
- The **axios interceptor** in `apiClient.ts` attaches your login token to every
  request, so you don't repeat that everywhere.

---

## 3. Good to know (this project's TypeScript is strict)

- Import types with **`import type { Foo }`** (the project uses
  `verbatimModuleSyntax`). Values (like `useQuery`) use a normal import.
- **No `enum`** — use a `const` object + a union type instead
  (`erasableSyntaxOnly` is on).
- Prefix unused function parameters with `_` (`noUnusedParameters` is on).
- Run `pnpm build` to catch type errors, and `pnpm lint` for style.

---

## 4. What to build next

See [`../docs/junior-dev-tasks.md`](../docs/junior-dev-tasks.md) for a guided list
of tasks — finishing the backend stubs and extending this UI (search, unenroll,
pagination, etc.).
