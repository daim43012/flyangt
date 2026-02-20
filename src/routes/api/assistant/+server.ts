// src/routes/api/assistant/+server.ts
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

import { ANG01_CONTEXT_RU, ANG01_CONTEXT_EN } from "$lib/prompts/ang01Context";
import { SYSTEM_PROMPT_EN, SYSTEM_PROMPT_RU } from "$lib/prompts/assistantSimple";

function detectLang(text: string): "ru" | "en" {
  return /[а-яё]/i.test(text) ? "ru" : "en";
}

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export const POST: RequestHandler = async ({ request, fetch }) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return json({ error: "Missing OPENAI_API_KEY on server" }, { status: 500 });
    }

    const body = await request.json();
    const prompt: string = body?.prompt ?? "";
    const langIn: string | undefined = body?.lang;
    const historyRaw: ChatMsg[] = Array.isArray(body?.history) ? body.history : [];

    if (!prompt.trim()) {
      return json({ error: "Missing prompt" }, { status: 400 });
    }

    const lang: "ru" | "en" =
      langIn === "ru" || langIn === "en" ? langIn : detectLang(prompt);

    const systemPrompt = lang === "ru" ? SYSTEM_PROMPT_RU : SYSTEM_PROMPT_EN;
    const projectContext = lang === "ru" ? ANG01_CONTEXT_RU : ANG01_CONTEXT_EN;

    // ограничим историю, чтобы не раздувать токены
    const history = historyRaw.slice(-12);

    const messages: ChatMsg[] = [
      { role: "system", content: systemPrompt },
      { role: "system", content: projectContext },
      ...history,
      { role: "user", content: prompt }
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages,
        temperature: 0.4,
        max_tokens: 450
      })
    });

    const data = await res.json();
    const reply: string | undefined = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.error("OpenAI error:", data);
      return json({ error: "OpenAI error", details: data }, { status: 500 });
    }

    return json({ reply, lang });
  } catch (err) {
    console.error("Server error:", err);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
