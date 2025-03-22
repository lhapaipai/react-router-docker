import { prisma } from "~/lib/prisma.server";
import type { Route } from "./+types/home";
import { Button } from "pentatrion-design/button";

export function meta({}: Route.MetaArgs) {
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
      <h1>Welcome users !</h1>
      <div>
        {users.map(({ id, name, email }) => (
          <div key={id}>
            {name} ({email})
          </div>
        ))}
      </div>
      <Button>Click me !</Button>
    </div>
  );
}
