import type { Topic } from '../../types';

export const mutations: Topic = {
  slug: 'mutations',
  title: 'Server Actions & Route Handlers',
  questions: [
    {
      kind: 'quiz',
      id: 'nx-m1',
      title: 'Server Action or Route Handler?',
      prompt: 'A mobile app needs to create orders through your Next.js backend. What should you build?',
      options: ['A Route Handler (`app/api/orders/route.ts`)', 'A Server Action', 'A Server Component', 'A Client Component with fetch'],
      answer: 0,
      why: "An external client like a mobile app needs a real HTTP endpoint with a stable URL, methods, status codes and headers, which is what a Route Handler (`app/api/orders/route.ts`) is. **Not a Server Action:** its endpoint id is generated per build and meant to be called by your own React UI. **Not a Server Component:** it renders UI, it can't accept a POST. **Not a Client Component with fetch:** that is a caller, it still needs an endpoint to call.",
    },
    {
      kind: 'quiz',
      id: 'nx-m2',
      title: 'Server Action benefits',
      prompt: 'Which are real benefits of Server Actions for in-app forms?',
      options: [
        'Progressive enhancement: `<form action={action}>` works before JS loads',
        'No manual fetch/endpoint code',
        'Built-in integration with `revalidatePath` / `revalidateTag`',
        'You no longer need to check authentication inside them',
      ],
      answer: [0, 1, 2],
      why: "Server Actions give progressive enhancement (`<form action={action}>` posts before JS loads), remove hand-written fetch/endpoint code, and integrate with `revalidatePath`/`revalidateTag` to refresh cached data after a mutation. **Not 'no auth checks needed':** an action is a public POST endpoint under the hood, so anyone can call it with crafted input; authenticate, authorize and validate inside every action.",
    },
    {
      kind: 'flashcard',
      id: 'nx-mf2',
      title: 'On-demand revalidation webhook',
      front: 'Your CMS must refresh cached product pages when an editor publishes. Sketch the endpoint.',
      back: `A Route Handler the CMS calls, protected by a shared secret:

\`\`\`
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const { tag, secret } = await req.json();
  if (secret !== process.env.REVALIDATION_SECRET) return Response.json({ error: 'Invalid secret' }, { status: 401 });
  if (!tag) return Response.json({ error: 'tag is required' }, { status: 400 });
  revalidateTag(tag);
  return Response.json({ revalidated: true });
}
\`\`\`

Prefer sending the secret in a header, and compare it in constant time. Use granular tags (\`product-123\`).`,
    },
    {
      kind: 'flashcard',
      id: 'nx-mf1',
      title: 'A Server Action end to end',
      front: 'Write a Server Action that saves a form and refreshes the page data, and say how to show a pending state.',
      back: `\`\`\`
'use server';
import { revalidatePath } from 'next/cache';

export async function submitFeedback(prevState: unknown, formData: FormData) {
  const feedback = formData.get('feedback');
  if (!feedback) return { error: 'Feedback is required' };
  await db.feedback.create({ data: { feedback: String(feedback) } });
  revalidatePath('/product/[slug]', 'page');
  return { success: true };
}
\`\`\`

Because it returns a result, wire it through \`useActionState\`: \`const [state, formAction, isPending] = useActionState(submitFeedback, null)\`, then \`<form action={formAction}>\` and render \`state?.error\`. (A plain \`<form action={fn}>\` discards the return value.) For a pending submit button, \`useFormStatus()\` in a child component.`,
    },
  ],
};
