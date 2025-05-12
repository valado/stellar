import { usePose } from "$stores/pose";
import { useHits } from "$stores/hits";
import { useTransparency } from "$demos/candlesticks/stores/transparency";

// Components
import { EyeIcon, EyeOffIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "$components/Button";
import { Overlay as BaseOverlay } from "$components/Overlay";
import { Scan } from "$components/Scan";

// Types
import type { FC, MouseEventHandler } from "react";

export const Overlay: FC = () => {
  const pose = usePose((state) => state.pose);
  const isTransparent = useTransparency((state) => state.isTransparent);
  const setIsTransparent = useTransparency((state) => state.setIsTransparent);

  const resetPose = usePose((state) => state.resetPose);
  const resetHits = useHits((state) => state.resetHits);

  const reset: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    resetHits();
    resetPose();
    setIsTransparent(false);
  };

  return (
    <BaseOverlay>
      {!pose && <Scan />}

      {pose && (
        <div className="absolute flex flex-col gap-4 bottom-4 right-4 z-10">
          <Button onClick={reset} className="w-12 h-12">
            <RotateCcwIcon />
          </Button>
          <Button
            onClick={() => setIsTransparent(!isTransparent)}
            className="w-12 h-12"
          >
            {isTransparent ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        </div>
      )}
    </BaseOverlay>
  );
};
