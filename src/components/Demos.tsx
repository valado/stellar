import { Link } from "react-router";

// Types
import type { FC } from "react";

type Demo = {
  name: string;
  href: string;
};

const DEMOS: Demo[] = [
  {
    name: "AR Immobilie",
    href: "/demos/house",
  },
  {
    name: "AR Bargeld",
    href: "/demos/cash",
  },
  {
    name: "AR Erdkugel",
    href: "/demos/earth",
  },
  {
    name: "Wrist UI",
    href: "/demos/wrist-ui",
  },
];

export const Demos: FC = () => (
  <div className="absolute top-0 left-0 grid place-content-center gap-16 w-full h-full p-8 pb-24">
    <div className="flex flex-col items-center gap-2">
      <img src="/logo.png" alt="Sopra Steria Custom Software Solutions Logo" />
      <h1 className="text-lg">Demos</h1>
    </div>
    <ul className="flex flex-col gap-1 list-disc list-inside">
      {DEMOS.map(({ name, href }, i) => (
        <li key={i}>
          <Link to={href} className="border-b-[0.1em]">
            {name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
