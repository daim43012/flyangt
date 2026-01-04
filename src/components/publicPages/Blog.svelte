<script lang="ts">
  export let data: any;

  const items = data?.items ?? [];
  const total = Number(data?.total ?? 0);
  const page = Number(data?.page ?? 1);
  const take = Number(data?.take ?? 24);

  const pages = Math.max(Math.ceil(total / take), 1);

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

  function pageHref(p: number) {
    const u = new URL(window.location.href);
    u.searchParams.set("page", String(p));
    u.searchParams.set("take", String(take));
    return u.pathname + u.search;
  }
</script>

<section class="blog">
  <div class="blog-header">
    <h1 class="blog-title">BLOG</h1>
    <p class="blog-subtitle">Ecosystem updates, stories, and releases.</p>
  </div>

  {#if !items.length}
    <div class="empty">
      <div class="empty-title">No posts yet</div>
      <div class="empty-text">Create a post in admin and it will appear here.</div>
    </div>
  {:else}
    <div class="grid">
      {#each items as p}
        <a class="card" href={`/post/${p.slug}`}>
          <div class="thumb">
            {#if p.image}
              <img src={p.image} alt={p.title} loading="lazy" />
            {:else}
              <div class="fallback">
                <div class="fallback-icon">✈︎</div>
              </div>
            {/if}
          </div>

          <div class="meta">
            <span class="date">{fmtDate(p.createdAt)}</span>
            <span class="pill">Update</span>
          </div>

          <h3>{p.title}</h3>

          {#if p.excerpt}
            <p>{p.excerpt}</p>
          {/if}
        </a>
      {/each}
    </div>

    {#if pages > 1}
      <div class="pager">
        <a
          class="pager-btn"
          aria-disabled={page <= 1}
          href={page <= 1 ? "#" : pageHref(page - 1)}
          on:click|preventDefault={() => {
            if (page > 1) location.href = pageHref(page - 1);
          }}
        >
          ← Prev
        </a>

        <div class="pager-mid">
          <span class="pager-label">Page</span>
          <span class="pager-value">{page} / {pages}</span>
        </div>

        <a
          class="pager-btn"
          aria-disabled={page >= pages}
          href={page >= pages ? "#" : pageHref(page + 1)}
          on:click|preventDefault={() => {
            if (page < pages) location.href = pageHref(page + 1);
          }}
        >
          Next →
        </a>
      </div>
    {/if}
  {/if}
</section>

<style>
  .blog {
    padding: 72px 16px 96px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .blog-header {
    text-align: center;
    margin-bottom: 56px;
  }

  .blog-title {
    font-size: 36px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    margin: 0;
    color: #0f172a;
  }

  .blog-subtitle {
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 26px;
  }

  .card {
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

  .card:hover {
    transform: translateY(-6px);
    box-shadow:
      0 26px 80px rgba(15, 23, 42, 0.12),
      0 10px 28px rgba(15, 23, 42, 0.08);
  }

  .thumb {
    width: 100%;
    height: 180px;
    border-radius: 18px;
    background: rgba(15, 23, 42, 0.04);
    overflow: hidden;
    margin-bottom: 14px;
    display: grid;
    place-items: center;
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .fallback {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.03);
  }

  .fallback-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: rgba(15, 23, 42, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #0f172a;
  }

  .meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }

  .date {
    font-size: 12px;
    color: #64748b;
    font-weight: 700;
  }

  .pill {
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

  .card h3 {
    margin: 8px 0 10px;
    font-size: 18px;
    font-weight: 800;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
    line-height: 1.15;
  }

  .card p {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .empty {
    text-align: center;
    padding: 28px 26px 30px;
    border-radius: 24px;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
  }

  .empty-title {
    font-weight: 900;
    color: #0f172a;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
  }

  .empty-text {
    color: #64748b;
    font-size: 13px;
  }

  .pager {
    margin-top: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .pager-btn {
    text-decoration: none;
    font-weight: 900;
    color: #0f172a;
    font-size: 13px;
    padding: 10px 14px;
    border-radius: 999px;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
    transition: transform 0.45s ease, box-shadow 0.45s ease;
  }

  .pager-btn:hover {
    transform: translateY(-3px);
    box-shadow:
      0 26px 80px rgba(15, 23, 42, 0.12),
      0 10px 28px rgba(15, 23, 42, 0.08);
  }

  .pager-btn[aria-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
  }

  .pager-mid {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.06);
  }

  .pager-label {
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 900;
  }

  .pager-value {
    font-size: 13px;
    font-weight: 900;
    color: #0f172a;
  }

  @media (max-width: 1024px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .blog {
      padding: 56px 16px 72px;
    }

    .blog-title {
      font-size: 20px;
      letter-spacing: 0.12em;
    }

    .grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .card {
      padding: 16px 16px 18px;
      border-radius: 20px;
    }

    .thumb {
      height: 160px;
      border-radius: 16px;
    }
  }
</style>
