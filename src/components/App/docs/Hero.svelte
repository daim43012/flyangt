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
    border-radius: 26px;
    padding: 22px 22px 18px;
    overflow: hidden;
    position: relative;

    background: linear-gradient(135deg, rgba(79, 70, 229, 1), rgba(147, 51, 234, 1));
    box-shadow: 0 26px 70px rgba(79, 70, 229, 0.28);
    min-height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 14px;                
  }

  .heroCard::before{
    content:"";
    position:absolute;
    inset:0;
    background:
      radial-gradient(900px 360px at 20% 10%, rgba(255, 255, 255, 0.22), transparent 55%),
      radial-gradient(800px 320px at 90% 40%, rgba(255, 255, 255, 0.14), transparent 60%);
    pointer-events:none;
  }

  .heroTop{ position:relative; z-index:1; }
  .heroText{ position:relative; z-index:1; max-width:760px; }
  .heroSearch{ position:relative; z-index:1; margin-top: 6px; } /* поиск ниже текста */

  .heroPill{
    height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.92);
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(10px);
  }

  .heroTitle{
    margin: 0;
    font-size: 44px;
    line-height: 1.05;
    font-weight: 950;
    letter-spacing: -0.04em;
    color: #fff;
  }

  .heroSubtitle{
    margin: 10px 0 0;
    font-size: 16px;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.86);
    max-width: 720px;
  }

  .heroSearchInner{
    width: min(820px, 100%);
    border-radius: 18px;
    padding: 14px 14px;
    display: flex;
    gap: 10px;
    align-items: center;

    background: rgba(255, 255, 255, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.22);
    backdrop-filter: blur(12px);
  }

  .heroSearchIcon{
    width: 28px;
    height: 28px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    color: rgba(255, 255, 255, 0.95);
    background: rgba(255, 255, 255, 0.10);
    border: 1px solid rgba(255, 255, 255, 0.16);
  }

  .heroSearchInput{
    width: 100%;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.95);
    background: transparent;
    border: 0;
    outline: none;
  }
  .heroSearchInput::placeholder{ color: rgba(255, 255, 255, 0.70); }

  .heroArt{
    position: absolute;
    right: -60px;
    bottom: -70px;
    width: 520px;
    height: 340px;
    border-radius: 90px;
    background: rgba(255,255,255,0.10);
    transform: rotate(-18deg);
    opacity: 0.9;
    pointer-events: none;
  }
</style>
