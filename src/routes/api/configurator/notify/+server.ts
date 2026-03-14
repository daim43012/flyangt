import type { RequestEvent } from "@sveltejs/kit";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const POST = async ({ request }: RequestEvent) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return json({ error: "Server config error" }, 500);
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body) return json({ error: "Invalid body" }, 400);

    const { name, email, phone, message, configuration, totalPrice, totalWeightKg, leadDays } = body as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
      configuration?: { title: string; price: number }[];
      totalPrice?: number;
      totalWeightKg?: number;
      leadDays?: number;
    };

    if (!name?.trim() || !email?.trim()) {
      return json({ error: "Name and email required" }, 400);
    }

    const configLines = (configuration ?? [])
      .map((c) => `  - ${c.title} — $${c.price.toLocaleString("en-US")}`)
      .join("\n");

    const text = [
      `New Configurator Request`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      ``,
      `Configuration:`,
      configLines,
      ``,
      `Total: $${(totalPrice ?? 0).toLocaleString("en-US")}`,
      `Weight: ${totalWeightKg ?? 0} kg`,
      `Lead time: ${leadDays ?? 90} days`,
      message ? `\nMessage: ${message}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const tgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Telegram API error:", errText);
      return json({ error: "Failed to send notification" }, 502);
    }

    return json({ ok: true });
  } catch (e) {
    console.error("Configurator notify error:", e);
    return json({ error: "Server error" }, 500);
  }
};
