<script lang="ts">
  import { goto } from '$app/navigation';

  let name = '';
  let email = '';
  let password = '';
  let password2 = '';
  let agree = false;

  let loading = false;
  let error = '';

  async function submit() {
    error = '';

    if (!agree) {
      error = 'Please accept the Terms and Privacy Policy.';
      return;
    }
    if (password !== password2) {
      error = 'Passwords do not match.';
      return;
    }

    loading = true;
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        const text = await res.text();
        error = text || 'Registration failed.';
        return;
      }

      await goto('/app/dashboard');
    } catch (e) {
      error = 'Network error. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<section class="auth">
  <div class="auth-card">
    <div class="auth-head">
      <div class="auth-kicker">ONBOARDING</div>
      <h1 class="auth-title">Create Account</h1>
      <p class="auth-subtitle">Get access first — connect Web3 later</p>
    </div>

<a class="auth-google" href="/api/auth/google">
  <span class="g-dot" aria-hidden="true"></span>
  Continue with Google
</a>

    <div class="auth-divider" aria-hidden="true">
      <span>or</span>
    </div>

    {#if error}
      <div class="auth-error">{error}</div>
    {/if}

    <form class="auth-form" on:submit|preventDefault={submit}>
      <label class="field">
        <span class="label">Full name</span>
        <input class="input" type="text" bind:value={name} required />
      </label>

      <label class="field">
        <span class="label">Email</span>
        <input class="input" type="email" bind:value={email} required />
      </label>

      <label class="field">
        <span class="label">Password</span>
        <input class="input" type="password" bind:value={password} required />
      </label>

      <label class="field">
        <span class="label">Confirm password</span>
        <input class="input" type="password" bind:value={password2} required />
      </label>

      <label class="agree">
        <input class="checkbox" type="checkbox" bind:checked={agree} />
        <span>
          I agree to the <a href="/terms">Terms</a> and
          <a href="/privacy">Privacy Policy</a>
        </span>
      </label>

      <button class="primary" type="submit" disabled={loading}>
        {loading ? 'Creating…' : 'Create account'}
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
    padding: 56px 16px 84px;
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

  .primary:disabled,
  .auth-google:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }
  .auth-card {
    width: 100%;
    max-width: 520px;
    padding: 34px 32px 30px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 24px 80px rgba(15, 23, 42, 0.10),
      0 10px 26px rgba(15, 23, 42, 0.08);
    backdrop-filter: blur(14px);
  }

  .auth-head {
    text-align: center;
    margin-bottom: 22px;
  }

  .auth-kicker {
    font-size: 10px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: #64748b;
  }

  .auth-title {
    margin: 10px 0 0;
    font-size: 34px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    color: #0f172a;
    line-height: 1.05;
  }

  .auth-subtitle {
    margin: 10px 0 0;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #64748b;
    line-height: 1.5;
  }

  .auth-google {
    width: 100%;
    padding: 12px 14px;
    border-radius: 16px;
    border: 1px solid rgba(15, 23, 42, 0.10);
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    font-size: 13px;
    font-weight: 900;
    color: #0f172a;

    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease,
      border-color 0.35s ease;
  }

  .auth-google:hover {
    transform: translateY(-2px);
    border-color: rgba(37, 99, 235, 0.22);
    box-shadow: 0 22px 54px rgba(15, 23, 42, 0.10);
  }

  .g-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #2563eb;
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
    background: rgba(15, 23, 42, 0.08);
  }

  .auth-divider span {
    position: relative;
    padding: 0 12px;
    background: rgba(255, 255, 255, 0.92);
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #64748b;
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
    color: #64748b;
  }

  .input {
    width: 100%;
    padding: 12px 14px;
    border-radius: 16px;
    border: 1px solid rgba(15, 23, 42, 0.10);
    background: rgba(255, 255, 255, 0.95);
    outline: none;

    font-size: 14px;
    color: #0f172a;

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
    color: #64748b;
    line-height: 1.55;
    margin-top: 2px;
  }

  .agree a {
    color: #0f172a;
    font-weight: 900;
    text-decoration: none;
  }

  .agree a:hover {
    text-decoration: underline;
  }

  .checkbox {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    accent-color: #2563eb;
    margin-top: 2px;
  }

  .primary {
    width: 100%;
    padding: 13px 14px;
    border-radius: 16px;
    border: 0;
    cursor: pointer;

    background: #2563eb;
    color: #ffffff;
    font-size: 13px;
    font-weight: 900;

    box-shadow:
      0 18px 46px rgba(37, 99, 235, 0.28),
      0 8px 20px rgba(15, 23, 42, 0.12);

    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
  }

  .primary:hover {
    transform: translateY(-2px);
    box-shadow:
      0 26px 70px rgba(37, 99, 235, 0.30),
      0 10px 26px rgba(15, 23, 42, 0.14);
  }

  .hint {
    margin: 6px 0 0;
    font-size: 12px;
    text-align: center;
    color: #64748b;
  }

  .hint a {
    color: #0f172a;
    font-weight: 900;
    text-decoration: none;
  }

  .hint a:hover {
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    .auth {
      padding: 44px 16px 68px;
    }

    .auth-card {
      padding: 28px 22px 24px;
      border-radius: 20px;
    }

    .auth-title {
      font-size: 28px;
    }

    .auth-subtitle {
      font-size: 11px;
      letter-spacing: 0.18em;
    }
  }
</style>
