<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  $: token = $page.url.searchParams.get('token') ?? '';

  let password = '';
  let password2 = '';
  let loading = false;
  let error = '';
  let done = false;

  async function submit() {
    error = '';

    if (password !== password2) {
      error = 'Passwords do not match.';
      return;
    }
    if (password.length < 8) {
      error = 'Password must be at least 8 characters.';
      return;
    }

    loading = true;
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      if (!res.ok) {
        error = await res.text();
        return;
      }

      done = true;
      setTimeout(() => goto('/login'), 2500);
    } catch {
      error = 'Network error. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<section class="auth">
  <div class="auth-card">
    <div class="auth-head">
      <p class="auth-subtitle">Account recovery</p>
      <h1 class="auth-title">New password</h1>
      <p class="auth-lead">Choose a new password for your account</p>
    </div>

    {#if done}
      <div class="auth-success" role="status">
        <div class="success-icon">✓</div>
        <p class="success-title">Password updated!</p>
        <p class="success-text">Redirecting you to login…</p>
      </div>
    {:else if !token}
      <div class="auth-error" role="alert">
        Invalid or missing reset token. Please request a new link.
      </div>
      <p class="hint" style="text-align:center; margin-top: 16px;">
        <a href="/forgot">Request new link</a>
      </p>
    {:else}
      {#if error}
        <div class="auth-error" role="alert">{error}</div>
      {/if}

      <form class="auth-form" on:submit|preventDefault={submit}>
        <label class="field">
          <span class="label">New password</span>
          <input
            class="input"
            type="password"
            bind:value={password}
            required
            autocomplete="new-password"
            minlength="8"
          />
        </label>

        <label class="field">
          <span class="label">Confirm new password</span>
          <input
            class="input"
            type="password"
            bind:value={password2}
            required
            autocomplete="new-password"
            minlength="8"
          />
        </label>

        <button class="primary" type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Set new password'}
        </button>

        <p class="hint">
          <a href="/login">Back to login</a>
        </p>
      </form>
    {/if}
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
    background: linear-gradient(135deg, var(--accent-light), var(--accent), var(--accent-dark));
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

  .auth-error {
    margin: 0 0 14px;
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
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .input:focus {
    border-color: rgba(176, 141, 87, 0.4);
    box-shadow: 0 0 0 4px rgba(176, 141, 87, 0.10);
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
      0 18px 46px rgba(176, 141, 87, 0.28),
      0 8px 20px rgba(18,20,22,0.12);
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .primary:hover {
    transform: translateY(-2px);
    box-shadow:
      0 26px 70px rgba(176, 141, 87, 0.32),
      0 10px 26px rgba(18,20,22,0.14);
  }

  .primary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }

  .hint {
    margin: 4px 0 0;
    font-size: 12px;
    text-align: center;
    color: var(--text-muted);
  }

  .hint a {
    color: var(--text-main);
    font-weight: 600;
    text-decoration: none;
  }

  .hint a:hover { text-decoration: underline; }

  .auth-success {
    text-align: center;
    padding: 16px 0 8px;
  }

  .success-icon {
    width: 52px;
    height: 52px;
    border-radius: 18px;
    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.22);
    display: grid;
    place-items: center;
    margin: 0 auto 16px;
    font-size: 22px;
    color: var(--accent-dark);
  }

  .success-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-main);
    margin: 0 0 10px;
  }

  .success-text {
    font-size: 13px;
    line-height: 1.7;
    color: var(--text-muted);
    margin: 0;
  }

  @media (max-width: 640px) {
    .auth { padding: 64px 16px 80px; }
    .auth-card { padding: 28px 22px 24px; border-radius: 22px; }
    .auth-title { font-size: 30px; }
  }
</style>
