import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { createDemo } from "$factories/demo";
import { setPreferredColorScheme } from "@react-three/uikit";

// Components
import { StrictMode } from "react";
import { RouterProvider } from "react-router";
import { HydrateFallback } from "$components/HydrateFallback";
import { MainPage } from "$components/MainPage";

// CSS
import "./index.css";

setPreferredColorScheme("dark");

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "demos",
    HydrateFallback: () => <HydrateFallback />,
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
