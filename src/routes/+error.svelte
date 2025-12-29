<script lang="ts">
  export let status: number;
  export let error: Error;
</script>

<section class="error">
  <div class="card">
    <div class="code">{status ?? 404}</div>
    <h1>Page not found</h1>
    <p>
      The route you are looking for doesn’t exist or has been moved.
    </p>

    <a href="/" class="btn">Back to home</a>
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
      rgba(37, 99, 235, 0.08),
      transparent 60%
    );
  }

  .card {
    max-width: 420px;
    width: 100%;
    background: #ffffff;
    border-radius: 24px;
    padding: 32px 28px;
    text-align: center;
    box-shadow: 0 30px 80px rgba(2, 6, 23, 0.18);
    border: 1px solid rgba(15, 23, 42, 0.08);
  }

  .code {
    font-size: 56px;
    font-weight: 900;
    letter-spacing: 0.08em;
    color: #2563eb;
    margin-bottom: 6px;
  }

  h1 {
    margin: 0 0 10px;
    font-size: 20px;
    font-weight: 900;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  p {
    margin: 0 0 22px;
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
  }

  .btn {
    display: inline-block;
    padding: 12px 18px;
    border-radius: 14px;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: white;
    font-weight: 800;
    font-size: 13px;
    text-decoration: none;
    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.35);
  }

  .btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 40px rgba(37, 99, 235, 0.45);
  }
</style>
