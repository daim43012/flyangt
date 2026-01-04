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
    <h2 class="news-title">NEWSROOM</h2>
    <p class="news-subtitle">Latest updates from the ecosystem.</p>

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
  /* === SECTION (same vibe as paths) === */
  .news {
    padding: 72px 16px 96px;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* === HEADER === */
  .news-header {
    text-align: center;
    margin-bottom: 56px;
    position: relative;
  }

  .news-title {
    font-size: 36px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    margin: 0;
    color: #0f172a;
  }

  .news-subtitle {
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  .news-all {
    position: absolute;
    right: 0;
    top: 6px;
    text-decoration: none;
    font-weight: 800;
    color: #0f172a;
    font-size: 13px;
    padding: 10px 14px;
    border-radius: 999px;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease;
  }

  .news-all:hover {
    transform: translateY(-3px);
    box-shadow:
      0 26px 80px rgba(15, 23, 42, 0.12),
      0 10px 28px rgba(15, 23, 42, 0.08);
  }

  /* === GRID (same as paths-grid) === */
  .news-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 26px;
  }

  /* === CARD (same as path-card) === */
  .news-card {
    display: block;
    text-align: left;
    padding: 18px 18px 20px;
    border-radius: 24px;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease,
      border-color 0.45s ease;
    cursor: pointer;
    text-decoration: none;
  }

  .news-card:hover {
    transform: translateY(-6px);
    box-shadow:
      0 26px 80px rgba(15, 23, 42, 0.12),
      0 10px 28px rgba(15, 23, 42, 0.08);
  }

  /* === THUMB === */
  .news-thumb {
    width: 100%;
    height: 170px;
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
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: rgba(15, 23, 42, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #0f172a;
  }

  /* === META === */
  .news-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }

  .news-date {
    font-size: 12px;
    color: #64748b;
    font-weight: 700;
  }

  .news-pill {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 6px 10px;
    border-radius: 999px;
    color: #0f172a;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: rgba(15, 23, 42, 0.03);
    font-weight: 900;
  }

  /* === TEXT (same style as path-card h3/p) === */
  .news-h3 {
    margin: 8px 0 10px;
    font-size: 18px;
    font-weight: 800;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
    line-height: 1.15;
  }

  .news-p {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* === ERROR === */
  .news-error {
    padding: 18px;
    border-radius: 24px;
    border: 1px solid rgba(15, 23, 42, 0.06);
    background: #ffffff;
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
  }
  .news-error-title {
    font-weight: 900;
    color: #0f172a;
    margin-bottom: 6px;
  }
  .news-error-text {
    color: #64748b;
    font-size: 13px;
  }

  /* === SKELETON === */
  .skeleton {
    cursor: default;
  }
  .skeleton-thumb {
    height: 170px;
    border-radius: 18px;
    background: rgba(15, 23, 42, 0.06);
    margin-bottom: 14px;
  }
  .skeleton-line {
    height: 12px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.06);
    margin: 10px 0;
  }
  .w80 { width: 80%; }
  .w60 { width: 60%; }

  /* === RESPONSIVE (match your paths breakpoints) === */
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
      padding: 56px 16px 72px;
    }

    .news-title {
      font-size: 20px;
      letter-spacing: 0.12em;
    }

    .news-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .news-card {
      padding: 16px 16px 18px;
      border-radius: 20px;
    }

    .news-thumb {
      height: 160px;
      border-radius: 16px;
    }
  }
</style>
