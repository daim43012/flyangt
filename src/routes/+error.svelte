<script lang="ts">
  import { page } from "$app/stores";

  $: status = $page.status;
  $: message = $page.error?.message ?? "";

  const titles: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Access Denied",
    404: "Page Not Found",
    500: "Server Error"
  };

  $: title = titles[status] ?? "Something Went Wrong";
  $: description = status === 404
    ? "The route you are looking for doesn't exist or has been moved."
    : message || "An unexpected error occurred. Please try again later.";
</script>

<section class="error">
  <div class="card">
    <div class="icon">
      {#if status === 404}
        <i class="fa-solid fa-route"></i>
      {:else if status === 403 || status === 401}
        <i class="fa-solid fa-lock"></i>
      {:else}
        <i class="fa-solid fa-triangle-exclamation"></i>
      {/if}
    </div>

    <div class="code">{status}</div>
    <h1>{title}</h1>
    <p>{description}</p>

    <div class="actions">
      <a href="/" class="btn-primary home-btn">
        <i class="fa-solid fa-house"></i> Back to Home
      </a>
      <button class="btn-secondary back-btn" on:click={() => history.back()}>
        <i class="fa-solid fa-arrow-left"></i> Go Back
      </button>
    </div>
  </div>
</section>

<style>
  .error {
    min-height: calc(100vh - 120px);
    display: grid;
    place-items: center;
    padding: 32px 16px;
    background: radial-gradient(
      800px 400px at 50% 0%,
      rgba(176, 141, 87, 0.06),
      transparent 60%
    );
  }

  .card {
    max-width: 440px;
    width: 100%;
    background: var(--bg-white);
    border-radius: 26px;
    padding: 40px 32px;
    text-align: center;

    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
  }

  .icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: grid;
    place-items: center;
    margin: 0 auto 20px;

    font-size: 26px;
    color: var(--accent);
    background: linear-gradient(
      135deg,
      rgba(176, 141, 87, 0.06),
      rgba(176, 141, 87, 0.14)
    );
    border: 1px solid rgba(176, 141, 87, 0.15);
  }

  .code {
    font-family: var(--font-heading);
    font-size: 56px;
    font-weight: 600;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 8px;

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

  h1 {
    margin: 0 0 10px;
    font-family: var(--font-heading);
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-main);
  }

  p {
    margin: 0 0 28px;
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);
  }

  .actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .home-btn,
  .back-btn {
    height: 42px;
    padding: 0 20px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
  }

  .home-btn:hover,
  .back-btn:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 640px) {
    .card {
      padding: 32px 20px;
      border-radius: 22px;
    }

    .code {
      font-size: 44px;
    }

    h1 {
      font-size: 18px;
    }

    .actions {
      flex-direction: column;
    }

    .home-btn,
    .back-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
