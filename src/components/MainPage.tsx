import { useNavigate } from "react-router";

// Components
import { Button } from "$components/Button";

// Types
import type { FC } from "react";

export const MainPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-0 left-0 grid place-content-center gap-16 w-full min-h-full p-8 pb-24">
      <div className="flex flex-col items-center gap-2">
        <img
          src="/logo.png"
          alt="Sopra Steria Custom Software Solutions Logo"
        />
      </div>
      <Button onClick={() => navigate("/demos/earth")} className="h-12">
        Earth
      </Button>
      <Button onClick={() => navigate("/demos/house")} className="h-12">
        House
      </Button>
      <Button onClick={() => navigate("/demos/candlesticks")} className="h-12">
        Candlesticks
      </Button>
      <Button onClick={() => navigate("/demos/marketcap")} className="h-12">
        Market Cap
      </Button>
    </div>
  );
};
