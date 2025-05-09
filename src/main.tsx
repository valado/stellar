import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { createDemo } from "$factories/demo";

// Components
import { StrictMode } from "react";
import { RouterProvider } from "react-router";
import { Card } from "$components/Card";
import { Loader } from "$components/Loader";

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
    HydrateFallback: () => (
      <div className="absolute flex flex-col gap-4 top-1/2 left-1/2 -translate-1/2 select-none z-10">
        <Card>
          <div className="flex flex-col items-center gap-2 min-w-48 text-center">
            <Loader />
            <span className="font-2xl animate-pulse">Wird geladen...</span>
          </div>
        </Card>
      </div>
    ),
    children: [
      {
        path: "candlesticks",
        lazy: {
          Component: async () =>
            createDemo(await import("$demos/candlesticks/Demo")),
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
          Component: async () =>
            createDemo(await import("$demos/marketcap/Demo")),
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
