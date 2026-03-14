<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let name = "";
  let email = "";
  let password = "";
  let password2 = "";
  let agree = false;

  let referralCode = "";

  let loading = false;
  let error = "";

  onMount(() => {
    const ref = new URLSearchParams(location.search).get("ref");
    if (ref) referralCode = ref.toUpperCase().trim();
  });

  async function submit() {
    error = "";

    if (!agree) {
      error = "Please accept the Terms and Privacy Policy.";
      return;
    }
    if (password !== password2) {
      error = "Passwords do not match.";
      return;
    }

    loading = true;
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password, referralCode })
      });

      if (!res.ok) {
        const text = await res.text();
        error = text || "Registration failed.";
        return;
      }

      await goto("/app/dashboard");
    } catch (e) {
      error = "Network error. Please try again.";
    } finally {
      loading = false;
    }
  }
</script>

<section class="auth">
  <div class="auth-card">
    <div class="auth-head">
      <p class="auth-subtitle">Onboarding</p>
      <h1 class="auth-title">Create account</h1>
      <p class="auth-lead">Get access first, connect Web3 later</p>
    </div>

    <a class="auth-google" href="/api/auth/google{referralCode ? `?ref=${referralCode}` : ''}" aria-disabled={loading}>
      <span class="g-dot" aria-hidden="true"></span>
      Continue with Google
    </a>

    <div class="auth-divider" aria-hidden="true">
      <span>or</span>
    </div>

    {#if error}
      <div class="auth-error" role="alert">{error}</div>
    {/if}

    <form class="auth-form" on:submit|preventDefault={submit}>
      <label class="field">
        <span class="label">Full name</span>
        <input class="input" type="text" bind:value={name} required autocomplete="name" />
      </label>

      <label class="field">
        <span class="label">Email</span>
        <input class="input" type="email" bind:value={email} required autocomplete="email" />
      </label>

      <label class="field">
        <span class="label">Password</span>
        <input class="input" type="password" bind:value={password} required autocomplete="new-password" />
      </label>

      <label class="field">
        <span class="label">Confirm password</span>
        <input class="input" type="password" bind:value={password2} required autocomplete="new-password" />
      </label>

      <label class="field">
        <span class="label">Referral code (optional)</span>
        <input
          class="input"
          type="text"
          bind:value={referralCode}
          placeholder="ABC123"
          inputmode="text"
        />
      </label>

      <label class="agree">
        <input class="checkbox" type="checkbox" bind:checked={agree} />
        <span>
          I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
        </span>
      </label>

      <button class="primary" type="submit" disabled={loading}>
        {loading ? "Creating…" : "Create account"}
      </button>

      <p class="hint">
        Already a member?
        <a href="/login">Login</a>
      </p>
    </form>
  </div>
</section>

<style>
  .auth {
    min-height: calc(100vh - 120px);
    display: grid;
    place-items: center;
    padding: 80px 16px 96px;
  }

  .auth-card {
    width: 100%;
    max-width: 520px;
    padding: 34px 32px 30px;
    border-radius: 28px;

    background: var(--bg-white);
    border: 1px solid var(--border-soft);

    box-shadow:
      0 30px 90px rgba(18,20,22,0.08),
      0 8px 22px rgba(18,20,22,0.06);
  }

  .auth-head {
    text-align: center;
    margin-bottom: 22px;
  }

  .auth-title {
    margin: 10px 0 0;
    font-size: 44px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.05;

    background: linear-gradient(
      135deg,
      var(--accent-light),
      var(--accent),
      var(--accent-dark)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .auth-subtitle {
    margin: 0;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .auth-lead {
    margin: 14px 0 0;
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-muted);
  }

  .auth-google {
    width: 100%;
    padding: 12px 14px;
    border-radius: 16px;

    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    box-shadow: 0 14px 34px rgba(18,20,22,0.08);

    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-main);

    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease,
      border-color 0.35s ease;
  }

  .auth-google:hover {
    transform: translateY(-2px);
    border-color: rgba(37, 99, 235, 0.22);
    box-shadow: 0 22px 54px rgba(18,20,22,0.10);
  }

  .g-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: var(--accent);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
  }

  .auth-divider {
    position: relative;
    margin: 18px 0 14px;
    text-align: center;
  }

  .auth-divider::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--border-soft);
  }

  .auth-divider span {
    position: relative;
    padding: 0 12px;
    background: var(--bg-white);
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .auth-error {
    margin: 0 0 12px;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid rgba(239, 68, 68, 0.22);
    background: rgba(239, 68, 68, 0.06);
    color: #991b1b;
    font-size: 13px;
    line-height: 1.4;
  }

  .auth-form {
    display: grid;
    gap: 14px;
  }

  .field {
    display: grid;
    gap: 8px;
  }

  .label {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .input {
    width: 100%;
    padding: 12px 14px;
    border-radius: 16px;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    outline: none;

    font-size: 14px;
    color: var(--text-main);

    transition:
      border-color 0.3s ease,
      box-shadow 0.3s ease;
  }

  .input:focus {
    border-color: rgba(37, 99, 235, 0.40);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
  }

  .agree {
    display: inline-flex;
    align-items: flex-start;
    gap: 10px;

    font-size: 12px;
    line-height: 1.55;
    color: var(--text-muted);

    margin-top: 2px;
  }

  .agree a {
    color: var(--text-main);
    font-weight: 600;
    text-decoration: none;
  }

  .agree a:hover {
    text-decoration: underline;
  }

  .checkbox {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    accent-color: var(--accent);
    margin-top: 2px;
  }

  .primary {
    width: 100%;
    padding: 13px 14px;
    border-radius: 16px;
    border: 0;
    cursor: pointer;

    background: var(--accent);
    color: #ffffff;

    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;

    box-shadow:
      0 18px 46px rgba(37, 99, 235, 0.28),
      0 8px 20px rgba(18,20,22,0.12);

    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
  }

  .primary:hover {
    transform: translateY(-2px);
    box-shadow:
      0 26px 70px rgba(37, 99, 235, 0.30),
      0 10px 26px rgba(18,20,22,0.14);
  }

  .primary:disabled,
  .auth-google[aria-disabled="true"] {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
    pointer-events: none;
  }

  .hint {
    margin: 6px 0 0;
    font-size: 12px;
    text-align: center;
    color: var(--text-muted);
  }

  .hint a {
    color: var(--text-main);
    font-weight: 600;
    text-decoration: none;
  }

  .hint a:hover {
    text-decoration: underline;
  }

  @media (max-width: 1024px) {
    .auth-title {
      font-size: 34px;
    }
  }

  @media (max-width: 640px) {
    .auth {
      padding: 64px 16px 80px;
    }

    .auth-card {
      padding: 28px 22px 24px;
      border-radius: 22px;
    }

    .auth-title {
      font-size: 26px;
    }
  }
</style>