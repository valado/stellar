import { FC, MouseEvent, MouseEventHandler, useState } from "react";
import { XRDomOverlay } from "@react-three/xr";
import {
  XIcon,
  EyeIcon,
  EyeClosedIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Button } from "../Button";
import { useCrosshairStore } from "../../stores/crosshair";
import { Label } from "../Label";
import { Card } from "../Card";

type Props = {
  onExit: MouseEventHandler;
};

type LabelCategory = "financial" | "physical";

export const Overlay: FC<Props> = ({ onExit: handleExit }) => {
  const [areLabelsHidden, setAreLabelsHidden] = useState(false);
  const [labelCategory, setLabelCategory] =
    useState<LabelCategory>("financial");
  const isReady = useCrosshairStore((state) => state.visible);

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
        padding: "1em",
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
            left: "50%",
            bottom: "4em",
            transform: "translateX(-50%)",
          }}
        >
          <Button onClick={toggleLabelCategory}>
            <ArrowLeftIcon />
          </Button>
          <Button onClick={toggleLabelCategory}>
            <ArrowRightIcon />
          </Button>
        </div>
      )}
      {!isReady && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Card>Scanne Umgebung...</Card>
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
