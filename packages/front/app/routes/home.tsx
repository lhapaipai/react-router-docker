import { prisma } from "~/lib/prisma";
import type { Route } from "./+types/home";
import { Button } from "pentatrion-design/button";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const users = await prisma.user.findMany();
  return { users };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;

  return (
    <div>
      <div className="border-gray-2 m-2 border p-2">
        <h1 className="text-h1">Test Tailwind Titre</h1>
      </div>

      <div className="border-gray-2 m-2 border p-2">
        <h2>Test base de données</h2>
        <div>
          liste d'utilisateurs :
          {users.map(({ id, name, avatar }) => (
            <span key={id}>
              {name} {avatar && avatar.id}
            </span>
          ))}
        </div>
      </div>

      <div className="border-gray-2 m-2 border p-2">
        <h2>Test design system</h2>

        <Button>Click me !</Button>
      </div>
    </div>
  );
}
