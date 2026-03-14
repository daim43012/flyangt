<script lang="ts">
  import type { JSONContent } from "@tiptap/core";

  import { generateHTML } from "@tiptap/html";

  import StarterKit from "@tiptap/starter-kit";
  import Link from "@tiptap/extension-link";
  import Image from "@tiptap/extension-image";
  import Youtube from "@tiptap/extension-youtube";

  import { Table } from "@tiptap/extension-table";
  import { TableRow } from "@tiptap/extension-table-row";
  import { TableHeader } from "@tiptap/extension-table-header";
  import { TableCell } from "@tiptap/extension-table-cell";

  type Speaker = { name: string; photo?: string };

  type PostData = {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    image?: string | null;
    createdAt: string | Date;
    speakers: Speaker[];
    content: JSONContent;
  };

  type ReadMoreItem = {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    image?: string | null;
    createdAt: string | Date;
    speakers: Speaker[];
  };

  export let data: {
    post: PostData;
    readMore: ReadMoreItem[];
  };

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

  const extensions = [
    StarterKit,
    Link.configure({ openOnClick: false }),
    Image.configure({ allowBase64: false }),
    Youtube.configure({ controls: true, nocookie: false }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
  ];

  $: post = data.post;
  $: readMore = data.readMore ?? [];

  $: html = post?.content ? generateHTML(post.content, extensions) : "";
</script>

<section class="post">
  <div class="post-head">
    <a class="back" href="/">← Back to Blog</a>

    <div class="meta">
      <span class="meta-pill">Update</span>
      <span class="meta-dot">•</span>
      <span class="meta-date">{fmtDate(post.createdAt)}</span>
    </div>

    <h1 class="title">{post.title}</h1>

    {#if post.excerpt}
      <p class="excerpt">{post.excerpt}</p>
    {/if}

    {#if post.speakers?.length}
      <div class="speakers">
        {#each post.speakers as sp}
          <div class="speaker">
            {#if sp.photo}
              <img class="avatar" src={sp.photo} alt={sp.name} />
            {:else}
              <div class="avatar fallback">✈︎</div>
            {/if}
            <div class="speaker-name">{sp.name}</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  {#if post.image}
    <div class="cover">
      <img src={post.image} alt={post.title} />
    </div>
  {/if}

  <article class="content">
    {@html html}
  </article>

  {#if readMore.length}
    <section class="more">
      <div class="more-header">
        <h2 class="more-title">READ MORE</h2>
        <p class="more-subtitle">More posts from the ecosystem.</p>
      </div>

      <div class="more-grid">
        {#each readMore.slice(0, 6) as p}
          <a class="more-card" href={`/post/${p.slug}`}>
            <div class="more-icon">
              {#if p.image}
                <img src={p.image} alt={p.title} />
              {:else}
                <span>📰</span>
              {/if}
            </div>

            <div class="more-meta">
              <span class="more-date">{fmtDate(p.createdAt)}</span>
              <span class="more-pill">Post</span>
            </div>

            <h3>{p.title}</h3>
            {#if p.excerpt}
              <p>{p.excerpt}</p>
            {/if}
          </a>
        {/each}
      </div>
    </section>
  {/if}
</section>

<style>
.post {
  padding: 110px 16px 120px;
  max-width: 980px;
  margin: 0 auto;
}

.post-head {
  text-align: center;
  margin-bottom: 22px;
}

/* BACK BUTTON */
.back {
  display: inline-block;
  text-decoration: none;
  font-weight: 600;
  color: var(--text-main);
  font-size: 13px;

  padding: 10px 14px;
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

  margin-bottom: 18px;
}

.back:hover {
  transform: translateY(-3px);
  box-shadow:
    0 40px 110px rgba(18, 20, 22, 0.12),
    0 12px 32px rgba(18, 20, 22, 0.08);
  border-color: rgba(176, 141, 87, 0.35);
}

/* META */
.meta {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
}

.meta-pill {
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

.meta-dot {
  opacity: 0.55;
}

.meta-date {
  color: var(--text-muted);
}

/* TITLE + EXCERPT */
.title {
  font-size: 46px;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin: 0;
  color: var(--text-main);
  line-height: 1.06;
}

.excerpt {
  margin: 16px auto 0;
  max-width: 740px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-muted);
}

/* SPEAKERS */
.speakers {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.speaker {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 12px;
  border-radius: 999px;

  background: var(--bg-white);
  border: 1px solid var(--border-soft);

  box-shadow:
    0 18px 60px rgba(18, 20, 22, 0.06),
    0 6px 18px rgba(18, 20, 22, 0.04);
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.avatar.fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.04);
  font-weight: 700;
  color: var(--text-main);
}

.speaker-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  letter-spacing: -0.01em;
}

/* COVER */
.cover {
  border-radius: 26px;
  overflow: hidden;

  background: var(--bg-white);
  border: 1px solid var(--border-soft);

  box-shadow:
    0 30px 90px rgba(18, 20, 22, 0.08),
    0 8px 22px rgba(18, 20, 22, 0.06);

  margin: 22px 0 24px;
}

.cover img {
  width: 100%;
  height: auto;
  display: block;
}

/* CONTENT CARD */
.content {
  text-align: left;

  padding: 34px 34px 36px;
  border-radius: 26px;

  background: var(--bg-white);
  border: 1px solid var(--border-soft);

  box-shadow:
    0 30px 90px rgba(18, 20, 22, 0.08),
    0 8px 22px rgba(18, 20, 22, 0.06);
}

/* TIPTAP CONTENT */
.content :global(p) {
  margin: 0 0 14px;
  font-size: 15px;
  line-height: 1.85;
  color: rgba(51, 65, 85, 0.92);
}

.content :global(h2) {
  margin: 26px 0 10px;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text-main);
}

.content :global(h3) {
  margin: 20px 0 10px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text-main);
}

.content :global(ul),
.content :global(ol) {
  margin: 0 0 14px 18px;
  color: rgba(51, 65, 85, 0.92);
  line-height: 1.8;
}

.content :global(a) {
  color: var(--text-main);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.content :global(img) {
  max-width: 100%;
  height: auto;
  border-radius: 18px;
  display: block;
  margin: 16px 0;
}

.content :global(.youtube) {
  margin: 18px 0;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--border-soft);
}

/* TABLES */
.content :global(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 18px 0;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid var(--border-soft);
  background: var(--bg-white);
}

.content :global(th),
.content :global(td) {
  border: 1px solid var(--border-soft);
  padding: 12px 12px;
  vertical-align: top;
  font-size: 13px;
  color: rgba(51, 65, 85, 0.92);
}

.content :global(th) {
  background: rgba(15, 23, 42, 0.02);
  font-weight: 600;
  color: var(--text-main);
}

/* READ MORE */
.more {
  margin-top: 56px;
}

.more-header {
  text-align: center;
  margin-bottom: 34px;
}

.more-title {
  font-size: 34px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--text-main);
}

.more-subtitle {
  margin-top: 14px;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.more-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 34px;
}

.more-card {
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

.more-card:hover {
  transform: translateY(-8px);
  box-shadow:
    0 40px 110px rgba(18, 20, 22, 0.12),
    0 12px 32px rgba(18, 20, 22, 0.08);
  border-color: rgba(176, 141, 87, 0.35);
}

.more-icon {
  width: 100%;
  height: 140px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.04);
  display: grid;
  place-items: center;
  overflow: hidden;
  margin-bottom: 14px;
}

.more-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.more-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.more-date {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
}

.more-pill {
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

.more-card h3 {
  margin: 10px 0 10px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text-main);
  line-height: 1.2;
}

.more-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-muted);

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .title {
    font-size: 34px;
  }

  .more-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .post {
    padding: 80px 16px 90px;
  }

  .title {
    font-size: 28px;
  }

  .content {
    padding: 26px 22px 28px;
    border-radius: 22px;
  }

  .more-grid {
    grid-template-columns: 1fr;
    gap: 26px;
  }

  .more-card {
    border-radius: 22px;
  }
}
</style>
