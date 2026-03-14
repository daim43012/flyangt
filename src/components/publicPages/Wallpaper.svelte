<script lang="ts">
  import { onMount } from "svelte";

  export let pdfUrl = "/docs/WhitePaper ANGT.pdf";
  export let coverUrl = "/images/whitepaper.png";

  let loaded = false;

  onMount(() => {
    const img = new Image();
    img.src = coverUrl;
    if (img.complete) {
      loaded = true;
    } else {
      img.onload = () => (loaded = true);
    }
  });

  function downloadNameFromUrl(url: string) {
    try {
      const part = url.split("/").pop() || "whitepaper.pdf";
      return part.includes(".") ? part : `${part}.pdf`;
    } catch {
      return "whitepaper.pdf";
    }
  }
</script>

<section class="wp">
  <header class="wp-head">
    <div>
      <h2 class="wp-title">ANGT WHITEPAPER</h2>
      <p class="wp-sub">
        Technical overview • token economics • protocol mechanics.
      </p>
    </div>
  </header>

  <div class="wp-top">
    <div class="stat">
      <div class="stat-icon">📘</div>
      <div class="stat-body">
        <div class="stat-kicker">Document</div>
        <div class="stat-value">v1.0</div>
        <div class="stat-note">Readable PDF document</div>
      </div>
    </div>

    <div class="stat">
      <div class="stat-icon">📄</div>
      <div class="stat-body">
        <div class="stat-kicker">Pages</div>
        <div class="stat-value">7</div>
        <div class="stat-note">Quick overview format</div>
      </div>
    </div>

    <div class="stat">
      <div class="stat-icon">🧬</div>
      <div class="stat-body">
        <div class="stat-kicker">Network</div>
        <div class="stat-value">Polygon</div>
        <div class="stat-note">ANGT (ERC-20)</div>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head">
      <div>
        <h3>WHITEPAPER</h3>
        <p>
          Download the PDF and review the document in a clean readable format.
        </p>
      </div>
    </div>

    <div class="split">
      <div class="left">
        <div class="cover" class:cover-loaded={loaded}>
          <img
            src={coverUrl}
            alt="Whitepaper cover"
            loading="eager"
            fetchpriority="high"
            on:load={() => (loaded = true)}
          />
        </div>
      </div>

      <div class="right">
        <div class="desc">
          A concise technical document describing protocol mechanics, token
          economics, and system architecture. This version is optimized for
          quick reading and sharing.
        </div>

        <div class="actions">
          <a class="btn primary" href={pdfUrl} download={downloadNameFromUrl(pdfUrl)}>
            Download PDF
          </a>

          <a class="btn ghost" href={pdfUrl} target="_blank" rel="noreferrer">
            Open in new tab
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* размеры секции не трогаю */
  .wp {
    padding: 72px 16px 110px;
    max-width: 1200px;
    margin: 0 auto;
    color: var(--text-main);
  }

  .wp-head {
    max-width: 980px;
    margin: 0 auto 22px;
    justify-content: space-between;
    gap: 14px;
    text-align: center;
    margin-bottom: 56px;
  }

  /* === Typography как в crown === */
  .wp-title {
    margin: 0;
    font-size: 42px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-main);
    text-transform: none;
    font-style: normal;
  }

  .wp-sub {
    margin-top: 14px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  /* сетку/габариты не трогаю */
  .wp-top {
    max-width: 980px;
    margin: 0 auto 18px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  /* карточки: размеры (padding/radius) не трогаю, только стиль как crown */
  .stat {
    position: relative;
    padding: 22px;             /* НЕ МЕНЯЮ */
    border-radius: 24px;       /* НЕ МЕНЯЮ */
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    display: grid;
    grid-template-columns: 42px 1fr;
    gap: 14px;
    align-items: start;
    overflow: hidden;

    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease,
      border-color 0.45s ease;
  }

  .stat:hover {
    transform: translateY(-8px);
    box-shadow:
      0 40px 110px rgba(18, 20, 22, 0.12),
      0 12px 32px rgba(18, 20, 22, 0.08);
    border-color: rgba(176, 141, 87, 0.35);
  }

  .stat-icon {
    width: 42px;              /* НЕ МЕНЯЮ */
    height: 42px;             /* НЕ МЕНЯЮ */
    border-radius: 14px;      /* НЕ МЕНЯЮ */
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.06);
    display: grid;
    place-items: center;
    font-size: 20px;          /* НЕ МЕНЯЮ */
  }

  .stat-kicker {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-top: 2px;
  }

  /* value как crown metric-value: градиентный текст */
  .stat-value {
    margin-top: 10px;
    font-family: var(--font-heading, inherit);
    font-size: 18px;          /* НЕ МЕНЯЮ (как было) */
    font-weight: 600;
    line-height: 1;

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

    text-transform: none;
    font-style: normal;
    letter-spacing: -0.01em;
  }

  .stat-note {
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);
  }

  /* panel: размеры не трогаю, стиль как crown */
  .panel {
    max-width: 980px;
    margin: 0 auto 18px;
    padding: 22px;            /* НЕ МЕНЯЮ */
    border-radius: 24px;      /* НЕ МЕНЯЮ */
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    min-height: 620px;        /* НЕ МЕНЯЮ */

    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease,
      border-color 0.45s ease;
  }

  .panel:hover {
    transform: translateY(-6px);
    box-shadow:
      0 40px 110px rgba(18, 20, 22, 0.12),
      0 12px 32px rgba(18, 20, 22, 0.08);
    border-color: rgba(176, 141, 87, 0.30);
  }

  .panel-head h3 {
    margin: 2px 0 8px;
    font-size: 16px;          /* НЕ МЕНЯЮ */
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-main);
    text-transform: none;
    font-style: normal;
  }

  .panel-head p {
    margin: 0;
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);
  }

  /* layout не трогаю */
  .split {
    margin-top: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: stretch;
  }

  .left {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* размеры cover не меняю, но можно привести к теме (bg/бордер) */
  .cover {
    border-radius: 18px;      /* НЕ МЕНЯЮ */
    border: 1px solid rgba(15, 23, 42, 0.08);
    overflow: hidden;
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.10);
    height: 700px;            /* НЕ МЕНЯЮ */
    display: grid;
    place-items: center;
    position: relative;

    /* Shimmer placeholder пока изображение грузится */
    background:
      linear-gradient(
        105deg,
        rgba(15, 23, 42, 0.04) 0%,
        rgba(176, 141, 87, 0.06) 30%,
        rgba(15, 23, 42, 0.04) 60%,
        rgba(176, 141, 87, 0.04) 100%
      );
    background-size: 200% 100%;
    animation: shimmer 1.8s ease-in-out infinite;
  }

  /* После загрузки — убираем анимацию */
  .cover-loaded {
    animation: none;
    background: rgba(15, 23, 42, 0.02);
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    /* Начинаем прозрачным, плавно появляемся */
    opacity: 0;
    transition: opacity 0.55s ease;
  }

  .cover-loaded img {
    opacity: 1;
  }

  .right {
    border-radius: 18px;      /* НЕ МЕНЯЮ */
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: var(--bg-white);
    padding: 18px;            /* НЕ МЕНЯЮ */
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .desc {
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  /* === КНОПКИ: размер не трогаю, меняю оформление под crown === */
  .btn {
    padding: 10px 12px;       /* НЕ МЕНЯЮ */
    border-radius: 14px;      /* НЕ МЕНЯЮ */
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(15, 23, 42, 0.03);
    color: rgba(15, 23, 42, 0.92);

    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;

    cursor: pointer;
    text-decoration: none;
    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease,
      border-color 0.45s ease,
      background 0.45s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn:hover {
    transform: translateY(-2px);
    background: rgba(15, 23, 42, 0.05);
    border-color: rgba(176, 141, 87, 0.30);
    box-shadow:
      0 18px 50px rgba(18, 20, 22, 0.10);
  }

  .btn.primary {
    border-color: rgba(176, 141, 87, 0.36);
    background: rgba(176, 141, 87, 0.14);
    color: rgba(15, 23, 42, 0.92);
  }

  .btn.ghost {
    background: var(--bg-white);
  }

  @media (max-width: 900px) {
    .wp-top {
      grid-template-columns: 1fr;
    }
    .split {
      grid-template-columns: 1fr;
    }
    .cover {
      height: 360px; /* твой респонсив, оставил */
    }
  }

  @media (max-width: 720px) {
    .wp {
      padding: 56px 14px 72px; /* твой респонсив, оставил */
    }
    .wp-title {
      font-size: 22px;         /* твой респонсив, оставил */
      letter-spacing: 0.1em;
    }
    .wp-head {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>