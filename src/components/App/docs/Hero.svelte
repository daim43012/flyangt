<!-- src/lib/components/DocsHero.svelte -->
<script lang="ts">
  export let search = '';
</script>

<section class="heroWrap">
  <div class="heroCard">
    <div class="heroTop">
      <span class="heroPill">OFFICIAL DOCUMENTATION</span>
    </div>

    <div class="heroText">
      <h1 class="heroTitle">FlyANG Knowledge Base</h1>
      <p class="heroSubtitle">
        The single source of truth for your build. Access technical manuals, DCA legal requirements, and operational safety standards.
      </p>
    </div>

    <div class="heroSearch">
      <!-- <div class="heroSearchInner">
        <span class="heroSearchIcon" aria-hidden="true">⌕</span>
        <input
          class="heroSearchInput"
          bind:value={search}
          placeholder="Search for 'torque specs', 'wiring', or 'permit'..."
          aria-label="Search documentation"
        />
      </div> -->
    </div>

    <div class="heroArt" aria-hidden="true"></div>
  </div>
</section>

<style>
  .heroCard{
    border-radius: 20px;
    padding: 22px 22px 18px;
    overflow: hidden;
    position: relative;

    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    min-height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 14px;
  }

  .heroCard::before{
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(900px 360px at 20% 10%, rgba(176, 141, 87, 0.1), transparent 55%),
      radial-gradient(800px 320px at 90% 40%, rgba(122, 90, 45, 0.06), transparent 60%);
    pointer-events: none;
  }

  .heroTop{ position:relative; z-index:1; }
  .heroText{ position:relative; z-index:1; max-width:760px; }
  .heroSearch{ position:relative; z-index:1; margin-top: 6px; }

  .heroPill{
    height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-dark);
    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.22);
  }

  .heroTitle{
    margin: 0;
    font-size: 44px;
    line-height: 1.05;
    font-weight: 600;
    font-family: var(--font-heading);
    letter-spacing: -0.04em;
    color: var(--text-main);
  }

  .heroSubtitle{
    margin: 10px 0 0;
    font-size: 16px;
    line-height: 1.55;
    color: var(--text-muted);
    max-width: 720px;
  }

  .heroSearchInner{
    width: min(820px, 100%);
    border-radius: 18px;
    padding: 14px 14px;
    display: flex;
    gap: 10px;
    align-items: center;

    background: rgba(176, 141, 87, 0.06);
    border: 1px solid rgba(176, 141, 87, 0.22);
  }

  .heroSearchIcon{
    width: 28px;
    height: 28px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    color: var(--accent-dark);
    background: rgba(176, 141, 87, 0.1);
    border: 1px solid rgba(176, 141, 87, 0.22);
  }

  .heroSearchInput{
    width: 100%;
    font-size: 15px;
    color: var(--text-main);
    background: transparent;
    border: 0;
    outline: none;
  }
  .heroSearchInput::placeholder{ color: var(--text-muted); }

  .heroArt{
    position: absolute;
    right: -60px;
    bottom: -70px;
    width: 520px;
    height: 340px;
    border-radius: 90px;
    background: rgba(176, 141, 87, 0.06);
    transform: rotate(-18deg);
    pointer-events: none;
  }
</style>
