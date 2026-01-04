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
    padding: 72px 16px 96px;
    max-width: 980px;
    margin: 0 auto;
  }

  .post-head {
    text-align: center;
    margin-bottom: 22px;
  }

  .back {
    display: inline-block;
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
    transition: transform 0.45s ease, box-shadow 0.45s ease;
    margin-bottom: 18px;
  }
  .back:hover {
    transform: translateY(-3px);
    box-shadow:
      0 26px 80px rgba(15, 23, 42, 0.12),
      0 10px 28px rgba(15, 23, 42, 0.08);
  }

  .meta {
    display: inline-flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
  }

  .meta-pill {
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

  .meta-dot {
    opacity: 0.6;
  }

  .title {
    font-size: 44px;
    font-weight: 900;
    letter-spacing: -0.04em;
    margin: 0;
    color: #0f172a;
    text-transform: uppercase;
    font-style: italic;
    line-height: 1.05;
  }

  .excerpt {
    margin: 14px auto 0;
    max-width: 740px;
    font-size: 14px;
    line-height: 1.6;
    color: #64748b;
  }

  .speakers {
    display: flex;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 16px;
  }

  .speaker {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 999px;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
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
    font-weight: 900;
    color: #0f172a;
  }

  .speaker-name {
    font-size: 13px;
    font-weight: 900;
    color: #0f172a;
    text-transform: uppercase;
    font-style: italic;
  }

  .cover {
    border-radius: 24px;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
    margin: 22px 0 24px;
  }

  .cover img {
    width: 100%;
    height: auto;
    display: block;
  }

  .content {
    text-align: left;
    padding: 28px 26px 30px;
    border-radius: 24px;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
  }

  .content :global(p) {
    margin: 0 0 14px;
    font-size: 15px;
    line-height: 1.75;
    color: #334155;
  }

  .content :global(h2) {
    margin: 22px 0 10px;
    font-size: 22px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .content :global(h3) {
    margin: 18px 0 10px;
    font-size: 18px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .content :global(ul),
  .content :global(ol) {
    margin: 0 0 14px 18px;
    color: #334155;
    line-height: 1.7;
  }

  .content :global(a) {
    color: #0f172a;
    font-weight: 800;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .content :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 18px;
    display: block;
    margin: 14px 0;
  }

  .content :global(.youtube) {
    margin: 16px 0;
    border-radius: 18px;
    overflow: hidden;
  }

  .content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid rgba(15, 23, 42, 0.08);
  }

  .content :global(th),
  .content :global(td) {
    border: 1px solid rgba(15, 23, 42, 0.08);
    padding: 10px;
    vertical-align: top;
    font-size: 13px;
    color: #334155;
  }

  .content :global(th) {
    background: rgba(15, 23, 42, 0.03);
    font-weight: 900;
    color: #0f172a;
  }

  .more {
    margin-top: 44px;
  }

  .more-header {
    text-align: center;
    margin-bottom: 26px;
  }

  .more-title {
    font-size: 28px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    margin: 0;
    color: #0f172a;
  }

  .more-subtitle {
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  .more-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 26px;
  }

  .more-card {
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
    text-decoration: none;
  }

  .more-card:hover {
    transform: translateY(-6px);
    box-shadow:
      0 26px 80px rgba(15, 23, 42, 0.12),
      0 10px 28px rgba(15, 23, 42, 0.08);
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
    color: #64748b;
    font-weight: 700;
  }

  .more-pill {
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

  .more-card h3 {
    margin: 8px 0 10px;
    font-size: 18px;
    font-weight: 800;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
    line-height: 1.15;
  }

  .more-card p {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @media (max-width: 1024px) {
    .title {
      font-size: 30px;
    }
    .more-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .post {
      padding: 56px 16px 72px;
    }
    .title {
      font-size: 22px;
      letter-spacing: 0.12em;
    }
    .content {
      padding: 24px 22px 26px;
      border-radius: 20px;
    }
    .more-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .more-card {
      border-radius: 20px;
    }
  }
</style>
