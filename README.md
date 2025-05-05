<h1>
  <span>Stellar</span>
  <a href="https://github.com/valado/stellar/blob/main/.github/workflows/prod.yml">
    <img src="https://github.com/valado/stellar/actions/workflows/prod.yml/badge.svg" alt="CI-PROD"/>
  </a>
</h1>

## Installation

```bash
npm run install
```

## Project Structure

| File                     | Description                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `src/components`         | Contains shared components, e.g. `Button`.                                                                                 |
| `src/demos`              | Contains demos and their respective components, hooks and stores.                                                          |
| `src/factories`          | Contains utility factories.                                                                                                |
| `src/factories/demo.tsx` | Contains a factory `createDemo()` that takes a [demo file](#adding-a-new-demo) and wraps it inside an `XRSessionProvider`. |
| `src/hooks`              | Contains shared hooks, e.g. `useStartXR()`.                                                                                |
| `src/stores`             | Contains shared stores, e.g. `usePose()`.                                                                                  |
| `src/main.tsx`           | Entrypoint and route definitions.                                                                                          |

## Adding a New Demo

> [!IMPORTANT]
> Every demo file **MUST** export a React component named `Demo` and an XR store instance named `xrStore`. The exported properties will be used by the [`createDemo()`](src/factories/demo.tsx) factory to wrap an `XRSessionProvider` around the `Demo` component.

Assuming `foo` is the name of the new demo:

1. Create a new file called `Demo.tsx` under `src/demos/foo`;
2. Export a React component named `Demo` and an XR store instance named `xrStore` as follows:

```tsx
import { createXRStore } from "@react-three/xr";

// ⚠️ The XR store instance must be called `xrStore`.
export const xrStore = createXRStore({
  // ...
});

// ⚠️ The component MUST be named `Demo`.
export const Demo: FC = () => null;
```

3. Add a new entry to the router configuration inside `src/main.tsx`:

```tsx
const router = createBrowserRouter([
  {
    path: "demos",
    children: [
      {
        path: "foo",
        lazy: {
          Component: async () => createDemo(await import("$demos/foo/Demo")),
        },
      },
    ],
  },
]);
```

## Interacting with XR Sessions

You have access to all XR-related hooks within a `Demo` component and all its children.

### Entering and Exiting

Simply include `useEnterXR()` or `useExitXR()` from `$hooks/xr-session` depending on your use case.
Both hooks return a `MouseEventHandler<HTMLButtonElement>`, so the value can be directly assigned to an `onClick` listener of a `<button>` element.

```tsx
import { useEnterXR } from "$hooks/xr-session";

export const Demo: FC = () => {
  const enterXR = useEnterXR("interactive-ar", () => {
    // This callback is called whenever the user exits the XR session.
    // Can be used to clean up the state.
  });

  return <button onClick={enterXR}>Enter XR</button>;
};
```
