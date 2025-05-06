import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { createDemo } from "$factories/demo";

// Components
import { StrictMode } from "react";
import { RouterProvider } from "react-router";

// CSS
import "./index.css";
import { MainPage } from "$components/MainPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "demos",
    children: [
      {
        path: "candlesticks",
        lazy: {
          Component: async () =>
            createDemo(await import("$demos/candlesticks/Demo")),
        },
      },
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
        path: "marketcap",
        lazy: {
          Component: async () => createDemo(await import("$demos/marketcap/Demo")),
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
  {
    path: "*",
    Component: null,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
