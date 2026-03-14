<script lang="ts">
  import { onMount, tick } from "svelte";
  import { browser } from "$app/environment";
  import { closeAdvisor, advisorPendingError, clearAdvisorError } from "$lib/stores/advisor";

  type Role = "user" | "assistant";
  type Msg = { role: Role; content: string; ts: number };

  const STORAGE_KEY = "flyangt_advisor_chat_v2";
  let storage: Storage | null = null;

  let input = "";
  let loading = false;
  let scrollEl: HTMLDivElement | null = null;

  const welcomeText =
    "Hi! I'm your FLYANGT Advisor. Ask me anything about the ANG-01 aircraft, ANGT token, presale, airdrop, staking, or the project roadmap.";

  function buildWelcome(): Msg {
    return { role: "assistant", content: welcomeText, ts: Date.now() };
  }

  let messages: Msg[] = [buildWelcome()];

  function initStorage() {
    if (!browser) return;
    storage = localStorage;
  }

  function saveChat() {
    if (!storage) return;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify({ messages }));
    } catch {}
  }

  function loadChat() {
    if (!storage) return;
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.messages) && parsed.messages.length) {
        messages = parsed.messages;
      }
    } catch {
      messages = [buildWelcome()];
    }
  }

  async function scrollToBottom() {
    await tick();
    if (!scrollEl) return;
    scrollEl.scrollTop = scrollEl.scrollHeight;
  }

  function newChat() {
    messages = [buildWelcome()];
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
          lang: "en",
          history: historyForApi
        })
      });

      const data = await res.json();

      const replyText =
        typeof data?.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : "Something went wrong. Please try again.";

      messages = [...messages, { role: "assistant", content: replyText, ts: Date.now() }];
      saveChat();
      await scrollToBottom();
    } catch {
      messages = [
        ...messages,
        { role: "assistant", content: "Connection error. Please try again.", ts: Date.now() }
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

    // Auto-send pending error if advisor was opened via "Ask Advisor" toast
    const pendingErr = $advisorPendingError;
    if (pendingErr) {
      clearAdvisorError();
      input = `I got an error: ${pendingErr}`;
      await tick();
      send();
    }
  });

  $: if (browser && storage) saveChat();
</script>

<div class="advisor">
  <div class="advisor__header">
    <div class="advisor__brand">
      <div class="advisor__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <div class="advisor__meta">
        <div class="advisor__title">FLYANGT Advisor</div>
        <div class="advisor__status">
          <span class="dot" aria-hidden="true"></span>
          Online
        </div>
      </div>
    </div>

    <div class="advisor__actions">
      <button class="new-chat-btn" on:click={newChat} type="button" title="New Chat">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        New Chat
      </button>

      <button class="close-btn" on:click={closeAdvisor} type="button" title="Close">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>

  <div class="advisor__history" bind:this={scrollEl}>
    {#each messages as m (m.ts)}
      <div class="msg msg--{m.role}">
        {#if m.role === "assistant"}
          <div class="msg__avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        {/if}
        <div class="msg__bubble">{m.content}</div>
      </div>
    {/each}

    {#if loading}
      <div class="msg msg--assistant">
        <div class="msg__avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="msg__bubble msg__bubble--typing">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    {/if}
  </div>

  <div class="advisor__composer">
    <input
      class="input"
      bind:value={input}
      placeholder="Ask about ANG-01, ANGT token, presale..."
      on:keydown={(e) => e.key === "Enter" && send()}
      disabled={loading}
    />
    <button class="send-btn" on:click={send} disabled={loading || !input.trim()} type="button">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 2L15 22l-4-9-9-4L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</div>

<style>
  .advisor {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 0;
    background: var(--bg-white);
    overflow: hidden;
  }

  /* Header */
  .advisor__header {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-soft);
    background: var(--bg-white);
  }

  .advisor__brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .advisor__icon {
    width: 40px;
    height: 40px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    color: var(--accent);
    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.18);
  }

  .advisor__title {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 15px;
    letter-spacing: -0.01em;
    color: var(--text-main);
    line-height: 1.1;
  }

  .advisor__status {
    margin-top: 3px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 99px;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
    display: inline-block;
    animation: pulse-dot 2.5s ease infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12); }
    50% { box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.06); }
  }

  .new-chat-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--border-soft);
    border-radius: 12px;
    padding: 8px 14px;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.02em;
    cursor: pointer;
    color: var(--text-muted);
    background: var(--bg-white);
    transition: all 0.2s ease;
  }

  .new-chat-btn:hover {
    color: var(--text-main);
    border-color: rgba(176, 141, 87, 0.3);
    background: rgba(176, 141, 87, 0.04);
    transform: translateY(-1px);
  }

  /* History */
  .advisor__history {
    flex: 1 1 auto;
    min-height: 0;
    padding: 20px;
    overflow-y: auto;
    background:
      radial-gradient(900px 350px at 10% 0%, rgba(176, 141, 87, 0.03) 0%, transparent 60%),
      var(--bg-main);
    scroll-behavior: smooth;
  }

  .advisor__history::-webkit-scrollbar {
    width: 4px;
  }

  .advisor__history::-webkit-scrollbar-track {
    background: transparent;
  }

  .advisor__history::-webkit-scrollbar-thumb {
    background: rgba(176, 141, 87, 0.15);
    border-radius: 99px;
  }

  /* Messages */
  .msg {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    margin-bottom: 14px;
    animation: msg-in 0.25s ease;
  }

  @keyframes msg-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
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
    color: var(--accent);
    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.18);
    flex: 0 0 auto;
  }

  .msg__bubble {
    max-width: min(600px, 78%);
    padding: 12px 16px;
    border-radius: 16px 16px 16px 6px;
    font-size: 13.5px;
    font-weight: 500;
    line-height: 1.6;
    white-space: pre-wrap;
    color: var(--text-main);
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow: 0 2px 8px rgba(18, 20, 22, 0.04);
  }

  .msg--user .msg__bubble {
    border-radius: 16px 16px 6px 16px;
    background: linear-gradient(135deg, rgba(176, 141, 87, 0.12), rgba(176, 141, 87, 0.06));
    border: 1px solid rgba(176, 141, 87, 0.22);
    color: var(--text-main);
  }

  /* Typing indicator */
  .msg__bubble--typing {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 14px 18px;
  }

  .typing-dot {
    width: 6px;
    height: 6px;
    border-radius: 99px;
    background: var(--accent);
    opacity: 0.4;
    animation: typing 1.4s ease-in-out infinite;
  }

  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typing {
    0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
    30% { opacity: 0.8; transform: translateY(-3px); }
  }

  /* Composer */
  .advisor__composer {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    border-top: 1px solid var(--border-soft);
    background: var(--bg-white);
  }

  .input {
    flex: 1;
    border-radius: 14px;
    padding: 12px 16px;
    border: 1px solid var(--border-soft);
    background: var(--bg-main);
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text-main);
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .input::placeholder {
    color: var(--text-muted);
    font-weight: 500;
    opacity: 0.55;
  }

  .input:focus {
    border-color: rgba(176, 141, 87, 0.35);
    box-shadow: 0 0 0 3px rgba(176, 141, 87, 0.06);
  }

  .input:disabled {
    opacity: 0.6;
  }

  .send-btn {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    border: none;
    display: grid;
    place-items: center;
    cursor: pointer;
    color: white;
    background: var(--accent);
    box-shadow: 0 4px 14px rgba(176, 141, 87, 0.25);
    transition: all 0.2s ease;
    flex: 0 0 auto;
  }

  .send-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(176, 141, 87, 0.3);
    filter: brightness(1.06);
  }

  .send-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .advisor__actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    display: grid;
    place-items: center;
    cursor: pointer;
    color: var(--text-muted);
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    color: var(--text-main);
    border-color: rgba(176, 141, 87, 0.3);
    background: rgba(176, 141, 87, 0.04);
  }

  /* Mobile */
  @media (max-width: 640px) {
    .advisor__header {
      padding: 14px 16px;
    }

    .advisor__history {
      padding: 14px 16px;
    }

    .advisor__composer {
      padding: 12px 16px;
    }

    .msg__bubble {
      max-width: 85%;
    }
  }
</style>
