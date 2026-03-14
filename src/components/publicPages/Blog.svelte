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
  padding: 110px 16px 120px;
  max-width: 1200px;
  margin: 0 auto;
}

.blog-header {
  text-align: center;
  margin-bottom: 72px;
}

.blog-title {
  font-size: 42px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0;
}

.blog-subtitle {
  margin-top: 14px;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 34px;
}

/* CARD */
.card {
  display: block;
  text-align: left;
  text-decoration: none;
  color: inherit;

  padding: 18px 18px 22px;
  border-radius: 26px;

  background: var(--bg-white);
  border: 1px solid var(--border-soft);

  box-shadow:
    0 30px 90px rgba(18, 20, 22, 0.08),
    0 8px 22px rgba(18, 20, 22, 0.06);

  transition:
    transform 0.45s ease,
    box-shadow 0.45s ease,
    border-color 0.45s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow:
    0 40px 110px rgba(18, 20, 22, 0.12),
    0 12px 32px rgba(18, 20, 22, 0.08);
  border-color: rgba(176, 141, 87, 0.35);
}

/* IMAGE */
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
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--text-main);
}

/* META */
.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.date {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
}

.pill {
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

/* TITLE + TEXT */
.card h3 {
  margin: 10px 0 10px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text-main);
  line-height: 1.2;
}

.card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-muted);

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* EMPTY */
.empty {
  text-align: center;
  padding: 32px 26px;
  border-radius: 26px;
  background: var(--bg-white);
  border: 1px solid var(--border-soft);
  box-shadow:
    0 30px 90px rgba(18, 20, 22, 0.06),
    0 8px 22px rgba(18, 20, 22, 0.04);
}

.empty-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-text {
  color: var(--text-muted);
  font-size: 14px;
}

/* PAGER */
.pager {
  margin-top: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
}

.pager-btn {
  text-decoration: none;
  font-weight: 600;
  color: var(--text-main);
  font-size: 13px;

  padding: 10px 16px;
  border-radius: 999px;

  background: var(--bg-white);
  border: 1px solid var(--border-soft);

  box-shadow:
    0 30px 90px rgba(18, 20, 22, 0.08),
    0 8px 22px rgba(18, 20, 22, 0.06);

  transition:
    transform 0.45s ease,
    box-shadow 0.45s ease,
    border-color 0.45s ease;
}

.pager-btn:hover {
  transform: translateY(-3px);
  box-shadow:
    0 40px 110px rgba(18, 20, 22, 0.12),
    0 12px 32px rgba(18, 20, 22, 0.08);
  border-color: rgba(176, 141, 87, 0.35);
}

.pager-btn[aria-disabled="true"] {
  opacity: 0.4;
  pointer-events: none;
}

.pager-mid {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid var(--border-soft);
}

.pager-label {
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 600;
}

.pager-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .blog {
    padding: 0 16px 90px;
  }

  .blog-title {
    font-size: 30px;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 26px;
  }

  .card {
    padding: 16px 16px 18px;
    border-radius: 22px;
  }

  .thumb {
    height: 160px;
    border-radius: 16px;
  }
}
</style>
