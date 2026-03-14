<!-- src/lib/components/DocsBlocks.svelte -->
<script lang="ts">
  export let search = '';

  type Category = 'Build' | 'Flight' | 'Maintenance';

  type Doc = {
    id: string;
    category: Category;
    title: string;
    excerpt: string;
    url: string;
    kind: 'pdf' | 'docx';
  };

  const docs: Doc[] = [
    {
      id: 'build-manual',
      category: 'Build',
      title: 'ANG Build Manual (05-04-2025)',
      excerpt: 'Complete aircraft build manual with step-by-step assembly instructions. Rev. 05-04-25.',
      url: '/docs/ANG-BUild-Manual-5-4-25-2-1-2.docx',
      kind: 'docx'
    },
    {
      id: 'construction',
      category: 'Build',
      title: 'Construction Manual & Technical Details',
      excerpt: 'Detailed construction specifications, materials and technical parameters.',
      url: '/docs/Construction-manual-and-Technical-Details.docx',
      kind: 'docx'
    },
    {
      id: 'kit-manual',
      category: 'Build',
      title: 'Kit Manual',
      excerpt: 'Assembly instructions for the ANG-01 kit version.',
      url: '/docs/ANG-01_CM_01-Assembly-instructions-KIT-rev1-ENG.docx',
      kind: 'docx'
    },
    {
      id: 'flight-manual',
      category: 'Flight',
      title: 'ANG Flight Manual',
      excerpt: 'Official flight manual covering procedures, performance data and limitations.',
      url: '/docs/Flight-Manual-ANG.pdf',
      kind: 'pdf'
    },
    {
      id: 'poh',
      category: 'Flight',
      title: 'POH \u2013 Pilot Operating Handbook',
      excerpt: 'Pilot operating handbook with checklists, systems and emergency procedures.',
      url: '/docs/POH-PIlot-Operating-Handbook.docx',
      kind: 'docx'
    },
    {
      id: 'weight-balance',
      category: 'Flight',
      title: 'ANG Weight and Balance Guide',
      excerpt: 'Weight and balance calculations, loading charts and CG envelope.',
      url: '/docs/Weight-and-Balance-Guide-1.docx',
      kind: 'docx'
    },
    {
      id: 'maintenance-manual',
      category: 'Maintenance',
      title: 'Aircraft Maintenance Manual',
      excerpt: 'Maintenance procedures, inspection intervals and servicing guidelines.',
      url: '/docs/ANG-Maintenance-Manual.pdf',
      kind: 'pdf'
    },
    {
      id: 'inspection',
      category: 'Maintenance',
      title: 'Conditional Inspection Form',
      excerpt: 'Inspection checklist form for conditional aircraft assessment.',
      url: '/docs/Conditional-Inspection-Form.docx',
      kind: 'docx'
    },
    {
      id: 'quality',
      category: 'Maintenance',
      title: 'Quality Assurance Manual',
      excerpt: 'Quality management system, standards and compliance procedures.',
      url: '/docs/Quality-Assurance-Manual.docx',
      kind: 'docx'
    }
  ];

  let tab: 'All' | Category = 'All';

  $: normalized = search.trim().toLowerCase();

  $: filtered = docs.filter((d) => {
    const byTab = tab === 'All' ? true : d.category === tab;
    if (!byTab) return false;
    if (!normalized) return true;
    return `${d.title} ${d.excerpt} ${d.category}`.toLowerCase().includes(normalized);
  });

  function iconFor(d: Doc) {
    if (d.kind === 'pdf') return '📄';
    if (d.category === 'Build') return '🔧';
    if (d.category === 'Flight') return '✈️';
    return '🛡️';
  }

  function openDoc(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function onCardKeydown(e: KeyboardEvent, url: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDoc(url);
    }
  }
</script>

<section class="tabsRow">
  <button class="tab {tab === 'All' ? 'active' : ''}" on:click={() => (tab = 'All')}>All</button>
  <button class="tab {tab === 'Build' ? 'active' : ''}" on:click={() => (tab = 'Build')}>Build</button>
  <button class="tab {tab === 'Flight' ? 'active' : ''}" on:click={() => (tab = 'Flight')}>Flight</button>
  <button class="tab {tab === 'Maintenance' ? 'active' : ''}" on:click={() => (tab = 'Maintenance')}>Maintenance</button>
</section>

<section class="grid">
  {#each filtered as doc (doc.id)}
    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
    <article
      class="card"
      role="button"
      tabindex="0"
      on:click={() => openDoc(doc.url)}
      on:keydown={(e) => onCardKeydown(e, doc.url)}
      aria-label={`Open document: ${doc.title}`}
    >
      <div class="left">
        <div class="icon" aria-hidden="true">{iconFor(doc)}</div>

        <div class="textBlock">
          <h3 class="title">{doc.title}</h3>
          <p class="excerpt">{doc.excerpt}</p>
        </div>
      </div>

      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="right" on:click|stopPropagation>
        <span class="pill">{doc.kind.toUpperCase()}</span>
        <a class="btn" href={doc.url} target="_blank" rel="noopener noreferrer">
          Open →
        </a>
      </div>
    </article>
  {/each}
</section>

<style>
  .tabsRow{
    display:flex;
    gap:14px;
    padding:26px 0 18px;
  }
  .tab{
    height:38px;
    padding:0 16px;
    border-radius:14px;
    border:1px solid var(--border-soft);
    background: var(--bg-white);
    color: var(--text-muted);
    font-weight:600;
    letter-spacing:-0.02em;
    cursor:pointer;
    transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
  }
  .tab:hover{ border-color: rgba(176, 141, 87, 0.3); color: var(--text-main); }
  .tab.active{ background: var(--accent); color:#fff; border-color: rgba(176, 141, 87, 0.3); }

  .grid{
    display:grid;
    grid-template-columns:repeat(2, minmax(0,1fr));
    gap:22px;
  }
  @media (max-width:720px){ .grid{ grid-template-columns:1fr; } }

  .card{
    border-radius:20px;
    padding:20px;
    min-height:150px;
    background: var(--bg-white);
    border:1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.06),
      0 6px 18px rgba(18, 20, 22, 0.04);

    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:24px;

    cursor:pointer;
    outline:none;
    transition: transform 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
  }
  .card:hover{
    transform: translateY(-2px);
    border-color: rgba(176, 141, 87, 0.22);
    box-shadow: 0 30px 90px rgba(18, 20, 22, 0.08), 0 8px 22px rgba(18, 20, 22, 0.06);
  }
  .card:focus-visible{
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.08),
      0 0 0 3px rgba(176, 141, 87, 0.30);
  }

  .left{
    display:flex;
    gap:14px;
    align-items:flex-start;
    min-width:0;
  }

  .icon{
    width:44px;
    height:44px;
    border-radius:14px;
    display:grid;
    place-items:center;
    background: rgba(176, 141, 87, 0.08);
    border:1px solid rgba(176, 141, 87, 0.22);
    font-size:18px;
    flex:0 0 auto;
  }

  .textBlock{
    display:flex;
    flex-direction:column;
    gap:6px;
    min-width:0;
  }

  .title{
    margin:0;
    font-size:15px;
    font-weight:600;
    font-family: var(--font-heading);
    letter-spacing:-0.02em;
    color: var(--text-main);
  }

  .excerpt{
    margin:0;
    font-size:13px;
    font-weight:600;
    color: var(--text-muted);
  }

  .right{
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    gap:12px;
    flex:0 0 auto;
  }

  .pill{
    height:28px;
    padding:0 12px;
    border-radius:999px;
    font-size:11px;
    font-weight:600;
    letter-spacing:0.06em;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    background: rgba(176, 141, 87, 0.08);
    border:1px solid rgba(176, 141, 87, 0.22);
    color: var(--accent-dark);
  }

  .btn{
    height:40px;
    padding:0 16px;
    border-radius:999px;
    border:1px solid rgba(176, 141, 87, 0.3);
    background: var(--accent);
    color:#fff;
    font-size:12px;
    font-weight:600;
    letter-spacing:-0.02em;
    cursor:pointer;
    box-shadow:0 14px 30px rgba(176, 141, 87, 0.2);
    display:inline-flex;
    align-items:center;
    justify-content:center;
    text-decoration:none;
    transition: transform 0.12s ease, filter 0.12s ease;
  }
  .btn:hover{ transform: translateY(-1px); filter: brightness(1.08); }
</style>
