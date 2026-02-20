<!-- src/lib/components/DocsBlocks.svelte -->
<script lang="ts">
  export let search = '';

  type Category = 'Technical' | 'Legal' | 'Safety';

  type Doc = {
    id: string;
    category: Category;
    title: string;
    excerpt: string;
    url: string; // from /static => /docs/...
    kind: 'image' | 'pdf';
  };

  const docs: Doc[] = [
    {
      id: 'dealer-cert',
      category: 'Legal',
      title: 'ANG World Official Country Dealer Certificate',
      excerpt: 'Official accreditation confirming Cyprus as an ANG Country Dealer.',
      url: '/docs/ANG%20World%20Official%20Country%20Dealer%20Certificate.jpeg',
      kind: 'image'
    },
    {
      id: 'bank-ref',
      category: 'Legal',
      title: 'Bank Reference Letter',
      excerpt: 'Bank reference letter confirming account standing and relationship.',
      url: '/docs/Bank%20Reference%20Letter.jpg',
      kind: 'image'
    },
    {
      id: 'directors',
      category: 'Legal',
      title: 'Certificate of Directors & Secretary',
      excerpt: 'Certificate confirming the director and secretary of the company.',
      url: '/docs/Certificate%20of%20Directors%20%26%20Secretary.jpeg',
      kind: 'image'
    },
    {
      id: 'office',
      category: 'Legal',
      title: 'Certificate of Registered Office',
      excerpt: 'Certificate confirming the registered office address in Cyprus.',
      url: '/docs/Certificate%20of%20Registered%20Office.jpg',
      kind: 'image'
    },
    {
      id: 'shareholders',
      category: 'Legal',
      title: 'Certificate of Shareholders',
      excerpt: 'Certificate confirming shareholders and number of shares.',
      url: '/docs/Certificate%20of%20Shareholders.jpg',
      kind: 'image'
    },
    {
      id: 'criminal',
      category: 'Safety',
      title: 'Criminal Record Clearance Letter',
      excerpt: 'Background check clearance letter for compliance and due diligence.',
      url: '/docs/Criminal%20Record%20Clearance%20Letter.jpeg',
      kind: 'image'
    },
    {
      id: 'memorandum',
      category: 'Legal',
      title: 'Memorandum & Articles of Association',
      excerpt: 'Statutory documents outlining the company structure and rules.',
      url: '/docs/Memorandum%20%26%20Articles%20of%20Association.pdf',
      kind: 'pdf'
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
    if (d.category === 'Legal') return '📜';
    if (d.category === 'Safety') return '🛡️';
    return '🛠️';
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
  <button class="tab {tab === 'Technical' ? 'active' : ''}" on:click={() => (tab = 'Technical')}>Technical</button>
  <button class="tab {tab === 'Legal' ? 'active' : ''}" on:click={() => (tab = 'Legal')}>Legal</button>
  <button class="tab {tab === 'Safety' ? 'active' : ''}" on:click={() => (tab = 'Safety')}>Safety</button>
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
        <span class="pill">{doc.category.toUpperCase()}</span>
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
    border:1px solid rgba(15,23,42,0.10);
    background:rgba(255,255,255,0.72);
    color:rgba(15,23,42,0.78);
    font-weight:900;
    letter-spacing:-0.02em;
    cursor:pointer;
  }
  .tab.active{ background:#0f172a; color:#fff; }

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
    background:#fff;
    border:1px solid rgba(15,23,42,0.08);
    box-shadow:
      0 18px 40px rgba(15,23,42,0.08),
      0 1px 0 rgba(255,255,255,0.85) inset;

    display:flex;
    justify-content:space-between;
    align-items:flex-start; /* всё вверх */
    gap:24px;

    cursor:pointer;
    outline:none;
    transition: transform 0.12s ease, filter 0.12s ease;
  }
  .card:hover{ transform: translateY(-2px); filter: brightness(0.995); }
  .card:focus-visible{
    box-shadow:
      0 18px 40px rgba(15,23,42,0.10),
      0 1px 0 rgba(255,255,255,0.85) inset,
      0 0 0 4px rgba(59,130,246,0.20);
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
    background:rgba(15,23,42,0.04);
    border:1px solid rgba(15,23,42,0.06);
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
    font-weight:950;
    letter-spacing:-0.02em;
    color:#0f172a;
  }

  .excerpt{
    margin:0;
    font-size:13px;
    font-weight:900;
    color:rgba(15,23,42,0.55);
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
    font-size:12px;
    font-weight:950;
    letter-spacing:-0.02em;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    background:rgba(248,250,252,0.95);
    border:1px solid rgba(15,23,42,0.08);
    color:rgba(15,23,42,0.72);
  }

  .btn{
    height:40px;
    padding:0 16px;
    border-radius:999px;
    border:1px solid rgba(15,23,42,0.12);
    background:#0f172a;
    color:#fff;
    font-size:12px;
    font-weight:950;
    letter-spacing:-0.02em;
    cursor:pointer;
    box-shadow:0 14px 30px rgba(15,23,42,0.18);
    display:inline-flex;
    align-items:center;
    justify-content:center;
    text-decoration:none;
    transition: transform 0.12s ease, filter 0.12s ease;
  }
  .btn:hover{ transform: translateY(-1px); filter: brightness(1.03); }
</style>
