import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "PocketURL" },
    { name: "description", content: "Welcome to PocketURL!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
