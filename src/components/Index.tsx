import { useNavigate } from "react-router";

// Components
import { Button } from "$components/Button";

// Types
import type { FC } from "react";

type Demo = {
  href: string;
  name: string;
};

const demos: Demo[] = [
  {
    name: "Immobilie",
    href: "/demos/house",
  },
  {
    name: "Candlesticks",
    href: "/demos/candlesticks",
  },
  {
    name: "Erdkugel",
    href: "/demos/earth",
  },
];

export const Index: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-0 left-0 grid place-content-center gap-16 w-full min-h-full p-8 pb-24">
      <div className="flex flex-col items-center gap-2">
        <img
          src="/logo.png"
          alt="Sopra Steria Custom Software Solutions Logo"
          className="select-none pointer-events-none"
        />
      </div>
      {demos.map(({ name, href }, i) => (
        <Button key={i} className="h-12" onClick={() => navigate(href)}>
          {name}
        </Button>
      ))}
    </div>
  );
};
