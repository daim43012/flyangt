<script lang="ts">
  export let data: any;

  const posts = data?.posts ?? [];

  function fmtDate(d: string | Date) {
    const dt = typeof d === "string" ? new Date(d) : d;
    try {
      return dt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return "—";
    }
  }
</script>

<section class="news">
  <div class="news-header">
    <h2 class="news-title">Newsroom</h2>
    <p class="news-subtitle">Latest updates from the ecosystem</p>

    <a class="news-all" href="/blog">
      View all →
    </a>
  </div>

  {#if !posts?.length}
    <div class="news-empty">
      No posts yet.
    </div>
  {:else}
    <div class="news-grid">
      {#each posts as p}
        <a class="news-card" href={`/post/${p.slug}`}>
          <div class="news-thumb">
            {#if p.image}
              <img src={p.image} alt={p.title} loading="lazy" />
            {:else}
              <div class="news-fallback">✈︎</div>
            {/if}
          </div>

          <div class="news-meta">
            <span class="news-date">{fmtDate(p.createdAt)}</span>
            <span class="news-pill">Update</span>
          </div>

          <h3 class="news-h3">{p.title}</h3>

          {#if p.excerpt}
            <p class="news-p">{p.excerpt}</p>
          {/if}
        </a>
      {/each}
    </div>
  {/if}
</section>

<style>
  .news {
  padding: 0 16px 120px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .news-header {
    text-align: center;
    margin-bottom: 72px;
    position: relative;
  }

  .news-title {
    font-size: 42px;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .news-subtitle {
    margin-top: 14px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .news-all {
    position: absolute;
    right: 0;
    top: 6px;

    text-decoration: none;
    font-weight: 600;
    color: var(--text-main);
    font-size: 13px;

    padding: 10px 14px;
    border-radius: 999px;

    background: var(--bg-white);
    border: 1px solid var(--border-soft);

    box-shadow:
      0 30px 90px rgba(18,20,22,0.08),
      0 8px 22px rgba(18,20,22,0.06);

    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease,
      border-color 0.45s ease;
  }

  .news-all:hover {
    transform: translateY(-3px);
    box-shadow:
      0 40px 110px rgba(18,20,22,0.12),
      0 12px 32px rgba(18,20,22,0.08);
    border-color: rgba(176,141,87,0.35);
  }

  .news-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 34px;
  }

  .news-card {
    display: block;
    text-align: left;
    text-decoration: none;
    color: inherit;

    padding: 18px 18px 22px;
    border-radius: 26px;

    background: var(--bg-white);
    border: 1px solid var(--border-soft);

    box-shadow:
      0 30px 90px rgba(18,20,22,0.08),
      0 8px 22px rgba(18,20,22,0.06);

    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease,
      border-color 0.45s ease;
  }

  .news-card:hover {
    transform: translateY(-8px);
    box-shadow:
      0 40px 110px rgba(18,20,22,0.12),
      0 12px 32px rgba(18,20,22,0.08);
    border-color: rgba(176,141,87,0.35);
  }

  .news-thumb {
    width: 100%;
    height: 178px;
    border-radius: 18px;
    background: rgba(15, 23, 42, 0.04);
    overflow: hidden;
    margin-bottom: 14px;
    display: grid;
    place-items: center;
  }

  .news-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .news-fallback {
    width: 44px;
    height: 44px;
    border-radius: 16px;
    background: rgba(15, 23, 42, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: var(--text-main);
  }

  .news-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }

  .news-date {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 600;
  }

  .news-pill {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;

    padding: 6px 10px;
    border-radius: 999px;

    color: var(--text-muted);
    border: 1px solid var(--border-soft);
    background: rgba(15, 23, 42, 0.02);
    font-weight: 700;
  }

  .news-h3 {
    margin: 10px 0 10px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-main);
    line-height: 1.2;
  }

  .news-p {
    margin: 0;
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .news-empty {
    text-align: center;
    color: var(--text-muted);
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    border-radius: 26px;
    padding: 28px 22px;
    box-shadow:
      0 30px 90px rgba(18,20,22,0.06),
      0 8px 22px rgba(18,20,22,0.04);
  }

  @media (max-width: 1024px) {
    .news-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .news-all {
      position: static;
      display: inline-block;
      margin-top: 18px;
    }
  }

  @media (max-width: 640px) {
    .news {
      padding: 80px 16px 90px;
    }

    .news-title {
      font-size: 30px;
    }

    .news-grid {
      grid-template-columns: 1fr;
      gap: 26px;
    }

    .news-card {
      padding: 16px 16px 18px;
      border-radius: 22px;
    }

    .news-thumb {
      height: 160px;
      border-radius: 16px;
    }
  }
</style>