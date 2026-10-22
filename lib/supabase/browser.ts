import { createClient } from "./client";

let browserClient: ReturnType<typeof createClient> | undefined;

export function getBrowserClient() {
  browserClient ??= createClient();
  return browserClient;
}
