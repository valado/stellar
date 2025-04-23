import {
  FC,
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { XRDomOverlay } from "@react-three/xr";
import {
  XIcon,
  EyeIcon,
  EyeClosedIcon,
  RulerDimensionLineIcon,
  EuroIcon,
} from "lucide-react";
import { Button } from "../Button";
import { useCrosshairStore } from "../../stores/crosshair";
import { Label } from "../Label";
import { Card } from "../Card";
import { Loader } from "../Loader";

type Props = {
  onExit: MouseEventHandler;
};

type LabelCategory = "financial" | "physical";

export const Overlay: FC<Props> = ({ onExit: handleExit }) => {
  const timeout = useRef<ReturnType<typeof setTimeout>>(null!);
  const [isTakingLong, setIsTakingLong] = useState(false);

  const [areLabelsHidden, setAreLabelsHidden] = useState(false);
  const [labelCategory, setLabelCategory] =
    useState<LabelCategory>("financial");
  const isReady = useCrosshairStore((state) => state.visible);

  useEffect(() => {
    if (!isReady) {
      timeout.current = setTimeout(() => {
        setIsTakingLong(true);
      }, 10 * 1000);
    } else {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    }

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [isReady]);

  const toggleLabels = (event: MouseEvent) => {
    event.stopPropagation();
    setAreLabelsHidden(!areLabelsHidden);
  };

  const toggleLabelCategory = (event: MouseEvent) => {
    event.stopPropagation();
    setLabelCategory(labelCategory === "financial" ? "physical" : "financial");
  };

  return (
    <XRDomOverlay
      style={{
        position: "relative",
        height: "100dvh",
        padding: "2em 1em",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button onClick={handleExit}>
          <XIcon />
        </Button>
        {isReady && (
          <Button onClick={toggleLabels}>
            {areLabelsHidden ? <EyeClosedIcon /> : <EyeIcon />}
          </Button>
        )}
      </div>
      {isReady && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            gap: "1em",
            right: "1em",
            bottom: "2.5em",
            transform: "translateY(-100%)",
          }}
        >
          <Button onClick={toggleLabelCategory}>
            {labelCategory === "financial" ? (
              <EuroIcon />
            ) : (
              <RulerDimensionLineIcon />
            )}
          </Button>
        </div>
      )}
      {!isReady && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -100%)",
          }}
        >
          <Card>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5em",
                textAlign: "center",
              }}
            >
              <Loader />
              <span style={{ fontSize: "1.05em" }}>Scanne Umgebung…</span>
              {isTakingLong && (
                <span style={{ color: "#9c9c9c" }}>
                  Das dauert länger als gewöhnlich…
                </span>
              )}
            </div>
          </Card>
        </div>
      )}
      {isReady &&
        !areLabelsHidden &&
        (labelCategory === "financial" ? (
          <>
            <Label title="Immobilienwert" value="€ 2.650.000" offsetX={-100} />
            <Label
              title="Mtl. Hypothekenzahlung"
              value="€ 6.100"
              offsetX={100}
            />
            <Label title="Zinssatz" value="2%" offsetY={100} />
            <Label title="Laufzeit" value="30 Jahre" offsetY={-100} />
          </>
        ) : (
          <>
            <Label title="Lage" value="Grünwald" offsetX={-100} />
            <Label title="Grundfläche" value="200 qm" offsetX={100} />
            <Label title="Etagen" value="2" offsetY={100} />
            <Label title="Energie-Effizienz" value="B" offsetY={-100} />
          </>
        ))}
    </XRDomOverlay>
  );
};
