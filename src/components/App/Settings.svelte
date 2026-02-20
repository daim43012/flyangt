<script lang="ts">
  export let data: {
    user: {
      id: string;
      email: string;
      name: string | null;
      phone: string | null;
      country: string | null;
      age: number | null;
      instagram: string | null;
      x: string | null;
      telegram: string | null;
    };
  };

  let loading = false;
  let errorMsg = "";

  let form = {
    fullName: data.user?.name ?? "",
    email: data.user?.email ?? "",
    phone: data.user?.phone ?? "",
    country: data.user?.country ?? "",
    age: data.user?.age != null ? String(data.user.age) : "",
    instagram: data.user?.instagram ?? "",
    x: data.user?.x ?? "",
    telegram: data.user?.telegram ?? "",
  };

  let initial = structuredClone(form);

  let isDirty = false;

  $: isDirty = JSON.stringify(form) !== JSON.stringify(initial);

  function cancel() {
    errorMsg = "";
    form = structuredClone(initial);
  }

  async function save() {
    errorMsg = "";
    loading = true;

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          phone: form.phone,
          country: form.country,
          age: form.age,
          instagram: form.instagram,
          x: form.x,
          telegram: form.telegram,
        }),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok || !result?.ok) {
        errorMsg = result?.error || "Save failed";
        return;
      }

      const u = result.user;
      form = {
        ...form,
        fullName: u?.name ?? form.fullName,
        email: u?.email ?? form.email,
        phone: u?.phone ?? "",
        country: u?.country ?? "Cyprus",
        age: u?.age !== null && u?.age !== undefined ? String(u.age) : "",
        instagram: u?.instagram ?? "",
        x: u?.x ?? "",
        telegram: u?.telegram ?? "",
      };

      initial = structuredClone(form);
    } finally {
      loading = false;
    }
  }
</script>

<div class="settings-page">
  {#if errorMsg}
    <div class="notice">{errorMsg}</div>
  {/if}

  <section class="block">
    <div class="block-head">
      <h2 class="block-title">Personal Information</h2>
    </div>

    <div class="form-grid">
      <div class="field">
        <label class="label" for="fullName">Full name</label>
        <input
          id="fullName"
          class="input"
          bind:value={form.fullName}
          placeholder="Your name"
        />
      </div>

      <div class="field">
        <label class="label" for="email">Email address</label>
        <input id="email" class="input" bind:value={form.email} disabled />
      </div>

      <div class="field">
        <label class="label" for="phone">Phone number</label>
        <input
          id="phone"
          class="input"
          bind:value={form.phone}
          placeholder="+357 99 123456"
        />
      </div>

      <div class="field">
        <label class="label" for="country">Country of residence</label>
        <input
          id="country"
          class="input"
          bind:value={form.country}
          placeholder="Cyprus"
          autocomplete="country-name"
        />
      </div>

      <div class="field">
        <label class="label" for="age">Age</label>
        <input
          id="age"
          class="input"
          bind:value={form.age}
          inputmode="numeric"
          placeholder="35"
        />
      </div>
    </div>
  </section>

  <section class="block">
    <div class="block-head">
      <h2 class="block-title">Social Connections</h2>
    </div>

    <div class="form-grid social-grid">
      <div class="field">
        <label class="label" for="ig">
          <span class="label-row">
            Instagram
            <span class="mini-pill ig" aria-hidden="true"></span>
          </span>
        </label>
        <input
          id="ig"
          class="input"
          bind:value={form.instagram}
          placeholder="https://instagram.com/..."
        />
      </div>

      <div class="field">
        <label class="label" for="x">
          <span class="label-row">
            X (Twitter)
            <span class="mini-pill x" aria-hidden="true"></span>
          </span>
        </label>
        <input
          id="x"
          class="input"
          bind:value={form.x}
          placeholder="https://x.com/..."
        />
      </div>

      <div class="field">
        <label class="label" for="tg">
          <span class="label-row">
            Telegram
            <span class="mini-pill tg" aria-hidden="true"></span>
          </span>
        </label>
        <input
          id="tg"
          class="input"
          bind:value={form.telegram}
          placeholder="@username"
        />
      </div>
    </div>
  </section>

  <div class="actions">
    <button
      class="btn btn-secondary"
      on:click={cancel}
      disabled={loading || !isDirty}
    >
      Cancel
    </button>

    <button
      class="btn btn-green"
      on:click={save}
      disabled={loading || !isDirty}
    >
      {#if loading}
        <span class="spin" aria-hidden="true"></span>
        Saving...
      {:else}
        Save changes
      {/if}
    </button>
  </div>
</div>

<style>
  .notice {
    margin: 0 0 14px;
    padding: 12px 14px;
    border-radius: 16px;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: rgba(127, 29, 29, 0.9);
    font-weight: 900;
    font-size: 13px;
  }

  .block {
    border-radius: 20px;
    padding: 18px 18px 16px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow:
      0 18px 40px rgba(15, 23, 42, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;
  }

  .block + .block {
    margin-top: 16px;
  }

  .block-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 6px 14px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    margin-bottom: 14px;
  }

  .block-title {
    margin: 0;
    font-size: 15px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 16px;
    padding: 4px 6px 6px;
  }

  .social-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .field {
    display: grid;
    gap: 8px;
    min-width: 0;
  }

  .label {
    font-size: 11px;
    font-weight: 950;
    letter-spacing: 0.02em;
    color: rgba(15, 23, 42, 0.7);
    text-transform: uppercase;
  }

  .label-row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .input {
    height: 44px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(255, 255, 255, 0.96);
    padding: 0 14px;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: -0.01em;
    outline: none;
    color: #0f172a;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9) inset;
    min-width: 0;
  }

  .input::placeholder {
    color: rgba(15, 23, 42, 0.35);
    font-weight: 800;
  }

  .input:focus {
    border-color: rgba(15, 23, 42, 0.35);
    box-shadow:
      0 0 0 4px rgba(59, 130, 246, 0.12),
      0 1px 0 rgba(255, 255, 255, 0.9) inset;
  }

  .input[disabled] {
    color: rgba(15, 23, 42, 0.55);
    background: rgba(15, 23, 42, 0.03);
    cursor: not-allowed;
    padding-right: 44px;
  }

  .mini-pill {
    height: 14px;
    width: 14px;
    border-radius: 5px;
    display: inline-block;
  }

  .mini-pill.ig {
    background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4);
  }

  .mini-pill.x {
    background: #0f172a;
  }

  .mini-pill.tg {
    background: linear-gradient(180deg, #38bdf8, #0ea5e9);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 0 0;
  }

  .btn {
    height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: #0f172a;
    color: #fff;
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    cursor: pointer;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition:
      transform 0.12s ease,
      filter 0.12s ease;
    user-select: none;
  }

  .btn:hover {
    transform: translateY(-1px);
    filter: brightness(1.03);
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .btn.btn-secondary {
    background: rgba(255, 255, 255, 0.92);
    color: rgba(15, 23, 42, 0.92);
    border: 1px solid rgba(15, 23, 42, 0.12);
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.1);
  }

  .btn.btn-green {
    background: linear-gradient(180deg, #22c55e, #16a34a);
    border-color: rgba(22, 163, 74, 0.9);
    color: #ffffff;
    box-shadow: 0 14px 30px rgba(34, 197, 94, 0.35);
  }

  .btn.btn-green:hover {
    filter: brightness(1.04);
  }

  .spin {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: rgba(255, 255, 255, 0.95);
    animation: spin 0.8s linear infinite;
    margin-right: 8px;
    vertical-align: -2px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 980px) {
    .form-grid {
      grid-template-columns: 1fr;
    }

    .social-grid {
      grid-template-columns: 1fr;
    }

    .actions {
      flex-direction: column-reverse;
    }

    .actions .btn {
      width: 100%;
    }
  }
</style>
