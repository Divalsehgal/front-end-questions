# Step 3: Mutations and Actions

Now that you have pages and components, how do you handle user input? In traditional React, you'd use `fetch` to an API. In Next.js, we use **Server Actions** to keep the logic close to the data.


## Mutations Strategy

Next.js provides two primary ways to handle data mutations (POST, PUT, DELETE). Choosing the right one depends on the consumer and the required level of control.

### Server Actions (Primary Choice)

- **Use Case:** UI-driven mutations such as forms, buttons, or toggles.
- **Benefits:**
  - **Zero HTTP Boilerplate:** No need to define manual fetch calls or endpoints.
  - **Progressive Enhancement:** Works natively with HTML forms even if JavaScript is disabled or hasn't loaded.
  - **Direct Execution:** Runs directly on the server with built-in security (CSRF protection).
  - **Cache Integration:** Easy integration with `revalidatePath` and `revalidateTag` to update the UI immediately.

### Route Handlers (API Routes)

- **Use Case:** External access from mobile apps, third-party services, or when specific HTTP headers/rate-limiting are required.
- **Benefits:**
  - **Standard REST:** Provides a public API surface.
  - **Full Control:** Access to the underlying Request and Response objects for custom headers and status codes.

## Implementation Patterns

### 1. Server Action with revalidatePath

```typescript
"use server";
import { revalidatePath } from "next/cache";

export async function submitData(formData: FormData) {
  const data = Object.fromEntries(formData);
  await db.save(data);
  revalidatePath("/path-to-update");
}
```

### 2. Route Handler

```typescript
export async function POST(req: Request) {
  const body = await req.json();
  await db.save(body);
  return Response.json({ success: true });
}
```

## Progressive Enhancement

- **With JS:** Enhance forms using `useFormStatus` or `useTransition` for loading indicators and optimistic UI updates.
- **Without JS:** Standard `<form action={action}>` ensures the application remains functional.

## Security Considerations

- **Server Actions:** Inherently secure within the Next.js ecosystem but still require manual authentication and authorization checks.
- **Route Handlers:** Require manual implementation of CSRF protection, rate limiting, and standard API security protocols.

## Final Recommendation

- **Default:** Use Server Actions for all internal application mutations.
- **Exceptions:** Use Route Handlers only for external consumers or advanced HTTP requirements.
