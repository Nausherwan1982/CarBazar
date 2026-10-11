import webPush from "web-push";
import { prisma } from "@/lib/prisma";

type StoredKeys = { p256dh: unknown; auth: unknown };

function getPushKeys(data: unknown): StoredKeys | undefined {
  if (!data || typeof data !== "object" || Array.isArray(data) || !("keys" in data)) return undefined;
  const keys = data.keys;
  if (!keys || typeof keys !== "object" || Array.isArray(keys) || !("p256dh" in keys) || !("auth" in keys)) return undefined;
  return typeof keys.p256dh === "string" && typeof keys.auth === "string"
    ? { p256dh: keys.p256dh, auth: keys.auth }
    : undefined;
}

function configureWebPush(): void {
  const publicKey = process.env.VAPID_PUBLIC;
  const privateKey = process.env.VAPID_PRIVATE;
  if (!publicKey || !privateKey) throw new Error("Set VAPID_PUBLIC and VAPID_PRIVATE to send push notifications.");
  webPush.setVapidDetails(`mailto:${process.env.BUSINESS_EMAIL || "support@carbazar.pk"}`, publicKey, privateKey);
}

export async function notifyAll(title: string, body: string, url = "/"): Promise<{ sent: number; failed: number }> {
  configureWebPush();
  const subscriptions = await prisma.pushSubscription.findMany();
  let sent = 0;
  let failed = 0;

  for (const subscription of subscriptions) {
    const keys = getPushKeys(subscription.data);
    if (!keys) {
      console.warn(`Skipping invalid push subscription ${subscription.id}.`);
      failed++;
      continue;
    }
    try {
      await webPush.sendNotification(
        { endpoint: subscription.endpoint, keys: { p256dh: keys.p256dh as string, auth: keys.auth as string } },
        JSON.stringify({ title, body, url }),
      );
      sent++;
    } catch (error) {
      const statusCode = typeof error === "object" && error !== null && "statusCode" in error
        ? error.statusCode
        : undefined;
      console.warn(`Push notification failed for subscription ${subscription.id}:`, error);
      failed++;
      if (statusCode === 404 || statusCode === 410) {
        await prisma.pushSubscription.delete({ where: { id: subscription.id } });
      }
    }
  }

  return { sent, failed };
}

export async function notifyPriceChanges(): Promise<{ sent: number; changes: number }> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const changes = await prisma.catalogHistory.findMany({
    where: { createdAt: { gte: since }, changeType: "price" },
    include: { model: { include: { brand: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  if (changes.length === 0) return { sent: 0, changes: 0 };

  const body = changes.slice(0, 5).map(({ model, oldPricePKR, newPricePKR }) =>
    `${model.brand.name} ${model.name}: Rs ${oldPricePKR?.toLocaleString() ?? "—"} → Rs ${newPricePKR?.toLocaleString() ?? "—"}`,
  ).join(" | ");
  const result = await notifyAll("Vehicle prices updated", body, "/cars");
  return { sent: result.sent, changes: changes.length };
}
