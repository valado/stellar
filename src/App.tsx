import { BrowserRouter, Routes, Route } from "react-router";
import { Demo as FinanceDemo } from "$components/demo/finance/Demo";
import { Demo as HouseDemo } from "$components/demo/house/Demo";

// Types
import type { FC } from "react";

export const App: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="demo">
        <Route path="finance" element={<FinanceDemo />} />
        <Route path="house" element={<HouseDemo />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
