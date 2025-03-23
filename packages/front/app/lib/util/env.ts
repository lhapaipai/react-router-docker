import { type ENV } from "~/env";

export function getPublicEnv<E extends keyof ENV>(value: E, defaultValue = ""): ENV[E] {
  return typeof window !== "undefined" ? window.ENV[value] : (defaultValue as ENV[E]);
}
