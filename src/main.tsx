import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { createDemo } from "$factories/demo";

// Components
import { StrictMode } from "react";
import { RouterProvider } from "react-router";

// CSS
import "./index.css";

const router = createBrowserRouter([
  {
    path: "demos",
    children: [
      {
        path: "cash",
        lazy: {
          Component: async () => createDemo(await import("$demos/cash/Demo")),
        },
      },
      {
        path: "earth",
        lazy: {
          Component: async () => createDemo(await import("$demos/earth/Demo")),
        },
      },
      {
        path: "house",
        lazy: {
          Component: async () => createDemo(await import("$demos/house/Demo")),
        },
      },
      {
        path: "wrist-ui",
        lazy: {
          Component: async () =>
            createDemo(await import("$demos/wrist-ui/Demo")),
        },
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
