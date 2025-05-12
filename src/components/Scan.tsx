import { useEffect, useRef, useState } from "react";
import { useHits } from "$stores/hits";

// Components
import { Card, CardContent } from "$components/Card";
import { Loader } from "$components/Loader";
import { LookAround } from "$components/LookAround";

// Types
import type { FC } from "react";

export const Scan: FC = () => {
  const [isTakingLonger, setIsTakingLonger] = useState(false);
  const hits = useHits((state) => state.hits);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null!);

  useEffect(() => {
    if (Object.keys(hits).length === 0) {
      timeoutRef.current = setTimeout(() => {
        setIsTakingLonger(true);
      }, 1000 * 10);
    } else {
      clearTimeout(timeoutRef.current);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [hits]);

  if (Object.keys(hits).length > 0) {
    return null;
  }

  return (
    <>
      <div className="absolute left-0 bg-neutral-200/50 blur-2xl w-full h-24 animate-scan"></div>
      <div className="absolute flex flex-col gap-4 top-1/2 left-1/2 -translate-1/2 select-none z-10">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-2 min-w-48 text-center">
              <Loader />
              <span className="font-2xl">Scanne Umgebung...</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid place-content-center p-6 gap-4">
            <LookAround />
            <span className="block text-center">
              {isTakingLonger
                ? "Keine Fläche erkannt. Bitte schaue Dich weiterhin um."
                : "Schaue mit Deinem Gerät den Boden entlang."}
            </span>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
