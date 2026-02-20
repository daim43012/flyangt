<script lang="ts">
  export let pdfUrl = "/docs/whitepaper.pdf";
  export let coverUrl = "/images/whitepaper.png";

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
        <div class="cover">
          <img src={coverUrl} alt="Whitepaper cover" loading="lazy" />
        </div>
      </div>

      <div class="right">
        <div class="desc">
          A concise technical document describing protocol mechanics, token
          economics, and system architecture. This version is optimized for
          quick reading and sharing.
        </div>

        <div class="actions">
          <a
            class="btn primary"
            href={pdfUrl}
            download={downloadNameFromUrl(pdfUrl)}
          >
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
  .wp {
    padding: 72px 16px 110px;
    max-width: 1200px;
    margin: 0 auto;
    color: #0f172a;
  }

  .wp-head {
    max-width: 980px;
    margin: 0 auto 22px;
    justify-content: space-between;
    gap: 14px;
    text-align: center;
    margin-bottom: 56px;
  }

  .wp-title {
    font-size: 36px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    margin: 0;
    color: #0f172a;
  }

  .wp-sub {
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  .wp-badges {
    display: inline-flex;
    gap: 8px;
  }

  .pill {
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 7px 10px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(15, 23, 42, 0.03);
    color: rgba(15, 23, 42, 0.78);
    white-space: nowrap;
    height: fit-content;
  }

  .pill.done {
    border-color: rgba(22, 163, 74, 0.35);
    background: rgba(22, 163, 74, 0.16);
    color: #14532d;
  }

  .wp-top {
    max-width: 980px;
    margin: 0 auto 18px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .stat {
    position: relative;
    padding: 22px;
    border-radius: 24px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
    display: grid;
    grid-template-columns: 42px 1fr;
    gap: 14px;
    align-items: start;
    overflow: hidden;
  }

  .stat-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: rgba(15, 23, 42, 0.04);
    display: grid;
    place-items: center;
    font-size: 20px;
  }

  .stat-kicker {
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #64748b;
    margin-top: 2px;
  }

  .stat-value {
    margin-top: 6px;
    font-size: 18px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .stat-note {
    margin-top: 6px;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
  }

  .panel {
    max-width: 980px;
    margin: 0 auto 18px;
    padding: 22px;
    border-radius: 24px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);

    min-height: 620px;
  }

  .panel-head h3 {
    margin: 2px 0 8px;
    font-size: 16px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .panel-head p {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
  }

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

  .cover {
    border-radius: 18px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: #f8fafc;
    overflow: hidden;
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.1);
    height: 700px;
    display: grid;
    place-items: center;
  }

  .cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .cover-hint {
    font-size: 12px;
    color: #64748b;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .right {
    border-radius: 18px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: #fff;
    padding: 18px;
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .right-top {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .mini {
    border-radius: 14px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: rgba(15, 23, 42, 0.02);
    padding: 10px 12px;
  }

  .mini-k {
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #64748b;
  }

  .mini-v {
    margin-top: 6px;
    font-size: 14px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    color: #0f172a;
  }

  .desc {
    font-size: 14px;
    line-height: 1.65;
    color: #334155;
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .btn {
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(15, 23, 42, 0.03);
    color: rgba(15, 23, 42, 0.92);
    font-size: 13px;
    cursor: pointer;
    text-decoration: none;
    transition:
      transform 160ms ease,
      background 160ms ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn:hover {
    transform: translateY(-1px);
    background: rgba(15, 23, 42, 0.05);
  }

  .btn.primary {
    border-color: rgba(22, 163, 74, 0.3);
    background: rgba(22, 163, 74, 0.14);
    color: #14532d;
  }

  .btn.ghost {
    background: #fff;
  }

  .note {
    margin-top: auto;
    font-size: 12px;
    color: #64748b;
    line-height: 1.5;
    border-top: 1px dashed rgba(15, 23, 42, 0.1);
    padding-top: 12px;
  }

  @media (max-width: 900px) {
    .wp-top {
      grid-template-columns: 1fr;
    }
    .split {
      grid-template-columns: 1fr;
    }
    .cover {
      height: 360px;
    }
  }

  @media (max-width: 720px) {
    .wp {
      padding: 56px 14px 72px;
    }
    .wp-title {
      font-size: 22px;
      letter-spacing: 0.1em;
    }
    .wp-head {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
