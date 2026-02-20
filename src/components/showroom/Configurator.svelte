<section class="cfg">
  <div class="cfg-header">
    <div class="cfg-chip">
      <span class="cfg-chipIcon">⚙️</span>
      Digital Tool
    </div>

    <h2 class="cfg-title">3D Configurator & Customization</h2>

    <p class="cfg-text">
      The FlyANGT platform provides access to a 3D aircraft configurator, allowing users to explore
      available configurations, colors, interiors, and technical options.
    </p>

    <div class="cfg-preview" aria-label="Configurator preview frame">
      <div class="cfg-previewTop">
        <span class="cfg-pill">Exterior</span>
        <span class="cfg-pill">Interior</span>
        <span class="cfg-pill">Technical</span>
        <span class="cfg-pill">Livery</span>
      </div>

      <div class="cfg-previewBody">
        <div class="cfg-ghost"></div>
        <div class="cfg-caption">Configurator Preview</div>
      </div>
    </div>

    <p class="cfg-text">
      Selected configurations are directly linked to the ordering process, ensuring clarity between
      design choices, documentation, and production parameters.
    </p>
  </div>
</section>

<style>
  .cfg {
    padding: 72px 16px 96px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .cfg-header {
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
  }

  .cfg-chip {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.06);
    color: #64748b;
    font-size: 11px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .cfg-chipIcon {
    width: 26px;
    height: 26px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);
    letter-spacing: 0;
  }

  .cfg-title {
    margin: 0 0 20px;
    font-size: 36px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    color: #0f172a;
  }

  .cfg-text {
    margin: 0 auto 14px;
    max-width: 640px;
    font-size: 13px;
    line-height: 1.65;
    color: #64748b;
  }

  .cfg-preview {
    max-width: 820px;
    margin: 18px auto 18px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.06), 0 6px 18px rgba(15, 23, 42, 0.04);
    overflow: hidden;
  }

  .cfg-previewTop {
    padding: 14px 14px 0;
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cfg-pill {
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.06);
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #64748b;
  }

  .cfg-previewBody {
    padding: 18px 16px 20px;
  }

  .cfg-ghost {
    height: 160px;
    border-radius: 18px;
    background:
      radial-gradient(420px 180px at 50% 20%, rgba(59, 130, 246, 0.08), transparent 62%),
      linear-gradient(180deg, rgba(15, 23, 42, 0.03), rgba(15, 23, 42, 0.01));
    border: 1px solid rgba(15, 23, 42, 0.06);
  }

  .cfg-caption {
    margin-top: 12px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  @media (max-width: 640px) {
    .cfg {
      padding: 56px 16px 72px;
    }
    .cfg-title {
      font-size: 20px;
      letter-spacing: 0.12em;
    }
    .cfg-ghost {
      height: 130px;
    }
  }
</style>
