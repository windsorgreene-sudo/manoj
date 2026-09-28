import "server-only";
import Pusher from "pusher";
import { integrations } from "@/lib/env";

let client: Pusher | null = null;

/** Publishes a realtime event via Pusher when configured. Without keys clients fall back to polling. */
export async function publish(channel: string, event: string, data: Record<string, unknown>) {
  if (!integrations.pusher()) return false;
  client ??= new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    useTLS: true,
  });
  try {
    await client.trigger(channel, event, data);
    return true;
  } catch (e) {
    console.warn("[realtime] publish failed", e);
    return false;
  }
}
