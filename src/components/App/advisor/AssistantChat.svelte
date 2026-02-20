<script lang="ts">
  import { onMount, tick } from "svelte";
  import { browser } from "$app/environment";

  type Role = "user" | "assistant";
  type Msg = { role: Role; content: string; ts: number };

  const STORAGE_KEY = "flyangt_advisor_chat_v1";
  const STORAGE_KIND: "session" | "local" = "local";
  let storage: Storage | null = null;

  let input = "";
  let loading = false;
  let lang: "auto" | "ru" | "en" = "auto";
  let scrollEl: HTMLDivElement | null = null;

  const welcomeTextRu =
    "Привет! Я ваш FLYANGT Advisor. Могу помочь с проектом токенизации самолёта ANG-01, характеристиками и логикой токенизации.";
  const welcomeTextEn =
    "Hi! I'm your FLYANGT Advisor. I can help with the ANG-01 aircraft tokenization project, specs, and tokenization logic.";

  function buildWelcome(l: typeof lang): Msg {
    const text = l === "en" ? welcomeTextEn : welcomeTextRu;
    return { role: "assistant", content: text, ts: Date.now() };
  }

  let messages: Msg[] = [buildWelcome(lang)];

  function initStorage() {
    if (!browser) return;
    storage = STORAGE_KIND === "session" ? sessionStorage : localStorage;
  }

  function saveChat() {
    if (!storage) return;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify({ lang, messages }));
    } catch (e) {
      console.warn("Storage save failed:", e);
    }
  }

  function loadChat() {
    if (!storage) return;
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed?.lang && (parsed.lang === "auto" || parsed.lang === "ru" || parsed.lang === "en")) {
        lang = parsed.lang;
      }
      if (Array.isArray(parsed?.messages)) {
        messages = parsed.messages;
      }
      if (!messages?.length) messages = [buildWelcome(lang)];
    } catch (e) {
      console.warn("Storage load failed:", e);
      messages = [buildWelcome(lang)];
    }
  }

  async function scrollToBottom() {
    await tick();
    if (!scrollEl) return;
    scrollEl.scrollTop = scrollEl.scrollHeight;
  }

  function newChat() {
    messages = [buildWelcome(lang)];
    input = "";
    loading = false;
    saveChat();
    scrollToBottom();
  }

  function toApiHistory(msgs: Msg[]) {
    return msgs.map((m) => ({ role: m.role, content: m.content }));
  }

  async function send() {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    input = "";

    messages = [...messages, { role: "user", content: userText, ts: Date.now() }];
    saveChat();
    await scrollToBottom();

    loading = true;
    await scrollToBottom();

    try {
      const historyForApi = toApiHistory(messages.slice(0, -1).slice(-14));

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userText,
          lang: lang === "auto" ? undefined : lang,
          history: historyForApi
        })
      });

      const data = await res.json();

      const replyText =
        typeof data?.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : "Ошибка ответа. Попробуйте ещё раз.";

      messages = [...messages, { role: "assistant", content: replyText, ts: Date.now() }];
      saveChat();
      await scrollToBottom();
    } catch (e) {
      messages = [
        ...messages,
        { role: "assistant", content: "Ошибка соединения с сервером.", ts: Date.now() }
      ];
      saveChat();
      await scrollToBottom();
    } finally {
      loading = false;
      await scrollToBottom();
    }
  }

  onMount(async () => {
    initStorage();
    loadChat();
    await scrollToBottom();
  });

  $: if (browser && storage) saveChat();
</script>

<div class="advisor">
  <div class="advisor__header">
    <div class="advisor__brand">
      <div class="advisor__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path d="M8 10.5h8M9 14h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path
            d="M9.5 7.5V6.2C9.5 5 10.5 4 11.7 4h.6c1.2 0 2.2 1 2.2 2.2V7.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M6.5 8.5h11A2.5 2.5 0 0 1 20 11v5.5A3.5 3.5 0 0 1 16.5 20h-9A3.5 3.5 0 0 1 4 16.5V11A2.5 2.5 0 0 1 6.5 8.5Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <div class="advisor__meta">
        <div class="advisor__title">FLYANGT Advisor</div>
        <div class="advisor__status">
          <span class="dot" aria-hidden="true"></span>
          AI ASSISTANCE ONLINE
        </div>
      </div>
    </div>

    <div class="advisor__actions">
      <select class="select" bind:value={lang} aria-label="Language">
        <option value="auto">Auto</option>
        <option value="ru">RU</option>
        <option value="en">EN</option>
      </select>

      <button class="btn btn--ghost" on:click={newChat} type="button">
        Новый чат
      </button>
    </div>
  </div>

  <!-- ✅ скроллится только история -->
  <div class="advisor__history" bind:this={scrollEl}>
    {#each messages as m (m.ts)}
      <div class="msg msg--{m.role}">
        {#if m.role === "assistant"}
          <div class="msg__avatar" aria-hidden="true">
            <div class="miniIcon">🤖</div>
          </div>
        {/if}
        <div class="msg__bubble">{m.content}</div>
      </div>
    {/each}

    {#if loading}
      <div class="msg msg--assistant">
        <div class="msg__avatar" aria-hidden="true">
          <div class="miniIcon">🤖</div>
        </div>
        <div class="msg__bubble msg__bubble--dim">…</div>
      </div>
    {/if}
  </div>

  <div class="advisor__composer">
    <input
      class="input"
      bind:value={input}
      placeholder="Например: Что такое токенизация ANG-01?"
      on:keydown={(e) => e.key === "Enter" && send()}
      disabled={loading}
    />
    <button class="btn" on:click={send} disabled={loading || !input.trim()} type="button">
      Send
    </button>
  </div>
</div>

<style>
  .advisor {
    width: 100%;
    max-width: 100%;

    display: flex;
    flex-direction: column;

    border-radius: 18px;
    border: 1px solid rgba(17, 24, 39, 0.08);
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
    box-shadow:
      0 10px 30px rgba(16, 24, 40, 0.08),
      0 2px 8px rgba(16, 24, 40, 0.04);
    overflow: hidden;

    height: min(84vh, 920px);
  }

  .advisor__header {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 18px;
    border-bottom: 1px solid rgba(17, 24, 39, 0.08);
    background: #ffffff;
  }

  .advisor__brand {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .advisor__icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: #2563eb;
    background: rgba(37, 99, 235, 0.10);
    border: 1px solid rgba(37, 99, 235, 0.18);
    flex: 0 0 auto;
  }

  .advisor__title {
    font-weight: 800;
    font-size: 14px;
    letter-spacing: 0.2px;
    color: #0f172a;
    line-height: 1.1;
  }

  .advisor__status {
    margin-top: 4px;
    font-size: 11px;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    color: rgba(15, 23, 42, 0.55);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 99px;
    background: #22c55e;
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
    display: inline-block;
  }

  .advisor__actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 0 0 auto;
  }

  .select {
    border: 1px solid rgba(17, 24, 39, 0.14);
    background: #fff;
    border-radius: 12px;
    padding: 9px 10px;
    font-size: 13px;
    color: #0f172a;
    outline: none;
  }

  .btn {
    border: none;
    border-radius: 12px;
    padding: 10px 14px;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    color: white;
    background: #2563eb;
  }

  .btn:disabled {
    opacity: 0.55;
    cursor: default;
  }

  .btn--ghost {
    color: #0f172a;
    background: rgba(15, 23, 42, 0.06);
    border: 1px solid rgba(15, 23, 42, 0.10);
  }

  /* ✅ Главное исправление: история занимает всё доступное место и скроллится */
  .advisor__history {
    flex: 1 1 auto;
    min-height: 0;            /* ✅ критично для flex+scroll */
    padding: 16px 18px;
    overflow-y: auto;
    background:
      radial-gradient(1200px 500px at 10% 0%, rgba(37, 99, 235, 0.06) 0%, rgba(255, 255, 255, 0) 55%),
      #f8fafc;
    scroll-behavior: smooth;
  }

  .msg {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    margin-bottom: 12px;
  }

  .msg--user {
    justify-content: flex-end;
  }

  .msg__avatar {
    width: 28px;
    height: 28px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    color: #2563eb;
    background: rgba(37, 99, 235, 0.10);
    border: 1px solid rgba(37, 99, 235, 0.18);
    flex: 0 0 auto;
  }

  .msg__bubble {
    max-width: min(920px, 82%);
    padding: 12px 14px;
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.45;
    white-space: pre-wrap;
    color: #0f172a;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: #ffffff;
    box-shadow: 0 1px 0 rgba(16, 24, 40, 0.03);
  }

  .msg--user .msg__bubble {
    background: #2563eb;
    border: 1px solid rgba(37, 99, 235, 0.35);
    color: #ffffff;
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.20);
  }

  .msg__bubble--dim {
    opacity: 0.7;
  }

  .advisor__composer {
    flex: 0 0 auto;
    display: flex;
    gap: 10px;
    padding: 14px 18px;
    border-top: 1px solid rgba(17, 24, 39, 0.08);
    background: #ffffff;
  }

  .input {
    flex: 1;
    border-radius: 14px;
    padding: 12px 14px;
    border: 1px solid rgba(17, 24, 39, 0.14);
    background: #ffffff;
    font-size: 14px;
    outline: none;
  }

  .input:disabled {
    opacity: 0.7;
  }

  @media (max-width: 640px) {
    .advisor {
      position: fixed;
      inset: 0;          
      height: 100dvh;
      border-radius: 0;
      box-shadow: none;
      border: none;
      z-index: 9999;
    }

    .advisor__header {
      padding: 14px 14px;
    }

    .advisor__history {
      padding: 14px 14px;
    }

    .advisor__composer {
      padding: 12px 14px;
    }

    .msg__bubble {
      max-width: 88%;
    }

    .btn {
      padding: 10px 12px;
    }
  }
</style>
