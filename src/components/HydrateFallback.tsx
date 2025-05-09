import { Card, CardContent } from "$components/Card";
import { Loader } from "$components/Loader";

// Types
import type { FC } from "react";

export const HydrateFallback: FC = () => (
  <div className="absolute flex flex-col gap-4 top-1/2 left-1/2 -translate-1/2 select-none z-10">
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-2 min-w-48 text-center">
          <Loader />
          <span className="font-2xl animate-pulse">Wird geladen...</span>
        </div>
      </CardContent>
    </Card>
  </div>
);
