import { codeFiles } from '../../files';
import type { Subject } from '../../types';

const code = codeFiles('testing', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const testing: Subject = {
  slug: 'testing',
  title: 'Testing',
  blurb: 'The testing pyramid, FIRST principles, React Testing Library habits, mocking, and reliable E2E tests with Playwright.',
  icon: 'flask',
  topics: [
    {
      slug: 'strategy',
      title: 'Strategy & principles',
      questions: [
        {
          kind: 'order',
          id: 'ts-o1',
          title: 'The testing pyramid',
          prompt: 'Order the layers of the testing pyramid from the BASE (most tests) to the TOP (fewest).',
          items: [
            'Unit tests: pure logic and isolated components',
            'Integration tests: components and services working together',
            'End-to-end tests: critical user journeys in a real browser',
          ],
          why: 'Lower layers are fast, cheap and precise; higher layers are slow and flaky but closest to reality. Many teams use the "testing trophy" instead, weighting integration tests most, since that\'s where frontend bugs live.',
        },
        {
          kind: 'quiz',
          id: 'ts-q1',
          title: 'FIRST',
          prompt: 'In the FIRST principles, what does the I stand for, and what does it rule out?',
          options: [
            "Isolated: tests don't depend on each other or on shared mutable state, so they can run in any order or in parallel",
            'Integrated: every test should hit the real API',
            'Immutable: tests may not change the DOM',
            'Incremental: write tests after the feature ships',
          ],
          answer: 0,
          why: "FIRST is Fast · Isolated · Repeatable · Self-validating · Timely; Isolated means no test depends on another or on shared mutable state, so order and parallelism don't matter. **Not Integrated:** hitting real APIs makes tests slow and non-repeatable. **Not Immutable:** tests change the DOM all the time, they just clean up. **Not Incremental after shipping:** that contradicts Timely (written alongside the code).",
        },
        {
          kind: 'quiz',
          id: 'ts-q2',
          title: 'shallow vs mount',
          prompt: "Why has the ecosystem moved away from Enzyme's `shallow()` rendering?",
          options: [
            'Shallow rendering tests implementation details (child components are stubbed), so tests break on refactors yet miss real integration bugs',
            'It is too slow',
            'It cannot render class components',
            'It requires a real browser',
          ],
          answer: 0,
          why: '`shallow()` stubs child components, so tests assert on component internals: they break on harmless refactors yet miss bugs in how parts integrate. Testing Library renders the full tree into jsdom and tests what the user sees. **Not too slow:** shallow is actually faster. **Not class components:** it renders them fine. **Not needs a real browser:** Enzyme runs in jsdom.',
        },
        {
          kind: 'quiz',
          id: 'ts-q3',
          title: 'What to mock',
          prompt: 'In an integration test for a checkout form, what should you mock?',
          options: [
            'The network boundary (e.g. MSW handlers), not your own components or hooks',
            'Every child component',
            'React state hooks',
            'Nothing; always call the production API',
          ],
          answer: 0,
          why: "Mock the edges you don't control, here the network (MSW handlers intercept `fetch`), and keep your own components and hooks real so the test exercises how they integrate. **Not every child component:** then it is no longer an integration test. **Not React state hooks:** mocking React internals tests nothing real. **Not the production API:** slow, flaky, and may create real orders.",
        },
        {
          kind: 'flashcard',
          id: 'ts-f1',
          title: 'Maintainable tests',
          front: 'What habits keep a test suite maintainable?',
          back: `- Descriptive test names that read like requirements; group with \`describe\`.
- **Arrange, Act, Assert** structure, one behaviour per test.
- No complex logic (loops, conditionals) inside tests.
- Query like a user (role, label, text); use \`data-testid\` only as a last resort.
- Control time and randomness (fake timers, seeded data).
- Delete or fix flaky tests promptly: a suite nobody trusts is worse than none.`,
        },
      ],
    },
    {
      slug: 'rtl',
      title: 'React Testing Library',
      questions: [
        {
          kind: 'order',
          id: 'rtl-o1',
          title: 'Query priority',
          prompt: 'Order Testing Library queries from MOST to LEAST preferred.',
          items: ['`getByRole` (with `name`)', '`getByLabelText`', '`getByText`', '`getByTestId`'],
          why: "Role queries match how assistive technology sees the page, so they double as accessibility checks. Labels come next for form fields, then visible text. Test ids are invisible to users, so they're a last resort.",
        },
        {
          kind: 'quiz',
          id: 'rtl-q1',
          title: 'getBy vs queryBy vs findBy',
          prompt: 'You need to assert that an error message is NOT shown. Which query?',
          options: ['`queryByText(...)` and expect it to be null', '`getByText(...)` inside a try/catch', '`findByText(...)`', '`getAllByText(...)`'],
          answer: 0,
          why: '`queryBy*` returns `null` when nothing matches, so `expect(queryByText(...)).toBeNull()` (or `.not.toBeInTheDocument()`) asserts absence cleanly. **Not getByText in try/catch:** getBy throws when missing; catching it hides real errors and reads badly. **Not findByText:** it waits and rejects when missing, slow and meant for things that appear. **Not getAllByText:** also throws when there are zero matches.',
        },
        {
          kind: 'quiz',
          id: 'rtl-q2',
          title: 'user-event vs fireEvent',
          prompt: "Why prefer `userEvent.type(input, 'hello')` over `fireEvent.change(input, { target: { value: 'hello' } })`?",
          options: [
            'userEvent simulates real interactions (focus, keydown, input, keyup per character), catching bugs fireEvent skips',
            'fireEvent is deprecated',
            'userEvent runs synchronously',
            'fireEvent does not trigger React handlers',
          ],
          answer: 0,
          why: "`userEvent` reproduces the real browser sequence per character (focus, keydown, keypress, input, keyup) and respects `maxlength`, `disabled` and pointer-events, so it catches bugs a single synthetic event skips. **Not fireEvent deprecated:** it still exists, it just dispatches one event. **Not userEvent synchronous:** v14 is async, you `await user.type(...)` from `userEvent.setup()`. **Not fireEvent skips React handlers:** React's root listener does receive it.",
        },
        {
          kind: 'flashcard',
          id: 'rtl-f1',
          title: 'Testing async UI',
          front: 'How do you test a component that fetches data and then shows it?',
          back: `1. Mock the network at the boundary (MSW handler returning the fixture).
2. \`render(<Users />)\` and assert the loading state.
3. \`expect(await screen.findByText(/ann/i)).toBeInTheDocument()\`: findBy retries until it appears. (A \`<li>\` gets no accessible name from its text, so \`findByRole('listitem', { name })\` wouldn't match.)
4. Assert that the loading state is gone (\`queryBy\` → null).
5. Test the error path by overriding the handler to return a 500.

Avoid arbitrary \`setTimeout\` waits; "not wrapped in act()" warnings usually mean an update happened after the test stopped waiting.`,
        },
        {
          kind: 'code',
          id: 'mock-fn',
          title: 'Build jest.fn()',
          difficulty: 'medium',
          prompt:
            'Re-implement the core of `jest.fn()`: record calls and results (including throws), plus `mockImplementation`, `mockReturnValue(Once)`, `mockResolvedValue`, `mockClear` and `mockReset`, all chainable.',
          ...code('mock-fn'),
        },
      ],
    },
    {
      slug: 'e2e',
      title: 'End-to-end with Playwright',
      questions: [
        {
          kind: 'quiz',
          id: 'e2e-q1',
          title: 'What to cover in E2E',
          prompt: 'For a critical flow like checkout, which scenarios belong in E2E tests?',
          options: ['The happy path', 'Validation errors', 'Network failures (simulated with route interception)', 'Every combination of CSS breakpoints'],
          answer: [0, 1, 2],
          why: 'E2E should cover the critical journey and its important failure modes: the happy path, validation errors, and network failures simulated deterministically with `page.route()`. **Not every CSS breakpoint combination:** combinatorial coverage is slow and belongs in cheaper unit, component or visual tests.',
        },
        {
          kind: 'quiz',
          id: 'e2e-q2',
          title: 'Avoiding flakiness',
          prompt: 'Which practice makes Playwright tests LESS flaky?',
          options: [
            "Web-first assertions like `await expect(page.getByRole('button', { name: 'Pay' })).toBeEnabled()`, which auto-wait",
            '`await page.waitForTimeout(3000)` before each step',
            'Selecting elements by generated CSS class names',
            'Sharing one logged-in browser state that every test mutates',
          ],
          answer: 0,
          why: "Web-first assertions (`await expect(locator).toBeEnabled()`) retry until the condition holds, so they wait exactly as long as needed. **Not waitForTimeout(3000):** fixed sleeps are slow when the app is fast and still flaky when it is slow. **Not generated class names:** they change on every build. **Not shared mutating login state:** tests couple to each other's side effects; use `storageState` per test and isolated data.",
        },
        {
          kind: 'flashcard',
          id: 'e2e-f1',
          title: 'Anatomy of a Playwright test',
          front: 'Write a minimal Playwright test for logging in, following Arrange-Act-Assert.',
          back: `\`\`\`
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  // Arrange
  await page.goto('/login');
  // Act
  await page.getByLabel('Email').fill('ann@example.test');
  await page.getByLabel('Password').fill(process.env.E2E_PASSWORD!);
  await page.getByRole('button', { name: 'Log in' }).click();
  // Assert
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});
\`\`\`

Log in once in a setup project and reuse \`storageState\` to keep suites fast.`,
        },
      ],
    },
  ],
};
