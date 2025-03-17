import type { Route } from "./+types/home";
import { Button } from "pentatrion-design/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <h1>Welcome !</h1>
      <Button>Click me !</Button>
    </div>
  );
}
