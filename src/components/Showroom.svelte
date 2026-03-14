<script>
  const steps = [
    {
      icon: "💡",
      name: "Interest",
      desc: "Explore ownership models and choose your path into aviation.",
    },
    {
      icon: "⚙️",
      name: "Configuration",
      desc: "Use the 3D configurator to select engine, avionics, interior and livery.",
    },
    {
      icon: "📋",
      name: "Order",
      desc: "Submit your order. Review specs, pricing, and legal documentation.",
    },
    {
      icon: "🏭",
      name: "Production",
      desc: "Aircraft is built with professional support and QA checkpoints.",
    },
    {
      icon: "🎓",
      name: "Training",
      desc: "Complete required pilot training and operational readiness programme.",
    },
    {
      icon: "✈️",
      name: "Flight",
      desc: "Your aircraft is registered, certified, and ready for the sky.",
    },
  ];
</script>

<section class="showroom">
  <div class="wrap">
    <!-- ===================== HERO ===================== -->
    <header class="hero">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="hero-img-wrap">
        <video
          class="hero-img"
          src="/video/plane.mp4"
          autoplay
          muted
          loop
          playsinline
          aria-hidden="true"
        ></video>
        <div class="hero-img-overlay" aria-hidden="true"></div>
      </div>
      <div class="hero-content">
        <div class="badge">
          <span class="badge-dot" aria-hidden="true"></span>
          ANG Aircraft · KIT Build
        </div>
        <h1 class="hero-title">
          The Aircraft.<br />The Ecosystem.
        </h1>
        <p class="hero-sub">
          A certified KIT aircraft platform with full ownership infrastructure,
          digital configuration, and tokenized participation.
        </p>
        <div class="hero-actions">
          <a class="btn-primary" href="/configurator">Configure yours</a>
          <a class="btn-ghost" href="#process">How it works</a>
        </div>
      </div>
    </header>

    <!-- ===================== AIRCRAFT STATS ===================== -->
    <!-- <section class="section">
      <div class="sec-label">Specifications</div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-img-wrap">
            <img
              class="stat-img"
              src="/images/plane.png"
              alt="ANG KIT Aircraft"
              loading="lazy"
            />
          </div>
          <div class="stat-info">
            <div class="stat-name">ANG KIT Aircraft</div>
            <div class="stat-sub">Five-seat composite light sport</div>
            <div class="specs">
              <div class="spec">
                <span class="sk">Engine</span><span class="sv"
                  >Rotax 916 iS · 160 hp</span
                >
              </div>
              <div class="spec">
                <span class="sk">Cruise</span><span class="sv">370 km/h</span>
              </div>
              <div class="spec">
                <span class="sk">Range</span><span class="sv">2 500 km</span>
              </div>
              <div class="spec">
                <span class="sk">MTOW</span><span class="sv">950 kg</span>
              </div>
              <div class="spec">
                <span class="sk">Avionics</span><span class="sv"
                  >Garmin G3X Touch</span
                >
              </div>
              <div class="spec">
                <span class="sk">Safety</span><span class="sv"
                  >BRS rescue system</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="stat-cards-col">
          <div class="mini-card accent-card">
            <div class="mc-label">Base price</div>
            <div class="mc-value">$ 190 500</div>
            <div class="mc-hint">KIT build, excl. options</div>
          </div>
          <div class="mini-card">
            <div class="mc-label">Lead time</div>
            <div class="mc-value">270-365 days</div>
            <div class="mc-hint">From order to delivery</div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- ===================== ABOUT ANG ===================== -->
    <section class="section">
      <div class="sec-header">
        <div class="sec-label">The Aircraft</div>
        <h2 class="sec-title">ANG — Aircraft New Generation</h2>
        <p class="sec-sub">
          The most advanced five-seat aircraft in its class. More cabin space,
          higher speed, greater range.
        </p>
      </div>

      <div class="about-card">
        <div class="about-bg" aria-hidden="true"></div>
        <div class="about-content">
          <p class="about-text">
            First designed and built in 2019 by leading Ukrainian aerospace
            engineers. Its full-carbon composite airframe makes the aircraft
            lighter and stiffer; its aerodynamic efficiency — with a unique
            glide ratio of 18.6 — delivers high TAS speeds, low fuel
            consumption, and exceptional range. Proprietary engineering
            solutions make it a world-class benchmark in its category.
          </p>
          <div class="highlights-grid">
            <div class="hl-item">
              <div class="hl-value">1.35 m</div>
              <div class="hl-label">Cabin width</div>
            </div>
            <div class="hl-item">
              <div class="hl-value">28 L/h</div>
              <div class="hl-label">Fuel consumption</div>
            </div>
            <div class="hl-item">
              <div class="hl-value">2 500 km</div>
              <div class="hl-label">Range</div>
            </div>
            <div class="hl-item">
              <div class="hl-value">370 km/h</div>
              <div class="hl-label">Cruise TAS</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== PERFORMANCE SPECS ===================== -->
    <section class="section">
      <div class="sec-header">
        <div class="sec-label">Flight Performance</div>
        <h2 class="sec-title">Built for speed, range, and efficiency</h2>
        <p class="sec-sub">
          Key performance figures at TAS 7 000 m, ISA standard configuration.
          Actual values may vary with weight, configuration, and air density.
        </p>
      </div>

      <div class="perf-grid">
        <div class="perf-card perf-main">
          <div class="perf-icon">⚡</div>
          <div class="perf-metric">
            <div class="perf-value">450 km/h</div>
            <div class="perf-unit">243 kts</div>
          </div>
          <div class="perf-name">Maximum speed (TAS)</div>
        </div>
        <div class="perf-card perf-main">
          <div class="perf-icon">✈️</div>
          <div class="perf-metric">
            <div class="perf-value">370 km/h</div>
            <div class="perf-unit">200 kts</div>
          </div>
          <div class="perf-name">Cruise speed (TAS)</div>
        </div>
        <div class="perf-card">
          <div class="perf-icon">🛫</div>
          <div class="perf-metric">
            <div class="perf-value">2 500 km</div>
            <div class="perf-unit">1 350 nm</div>
          </div>
          <div class="perf-name">Range</div>
        </div>
        <div class="perf-card">
          <div class="perf-icon">📐</div>
          <div class="perf-metric">
            <div class="perf-value">18.6</div>
            <div class="perf-unit">≈ 18 : 1</div>
          </div>
          <div class="perf-name">Glide ratio (L/D max)</div>
        </div>
      </div>

      <div class="specs-table">
        <div class="specs-row">
          <span class="specs-key">Cruise speed (TAS)</span>
          <span class="specs-val"
            >370 km/h <span class="specs-alt">(200 kts)</span></span
          >
        </div>
        <div class="specs-row">
          <span class="specs-key">Maximum speed (TAS)</span>
          <span class="specs-val"
            >450 km/h <span class="specs-alt">(243 kts)</span></span
          >
        </div>
        <div class="specs-row">
          <span class="specs-key">Cruise 65% (TAS)</span>
          <span class="specs-val"
            >350 km/h <span class="specs-alt">(189 kts)</span></span
          >
        </div>
        <div class="specs-row">
          <span class="specs-key">Cruise 55% (TAS)</span>
          <span class="specs-val"
            >335 km/h <span class="specs-alt">(180 kts)</span></span
          >
        </div>
        <div class="specs-row">
          <span class="specs-key">Range</span>
          <span class="specs-val"
            >2 500 km <span class="specs-alt">(1 350 nm)</span></span
          >
        </div>
        <div class="specs-row">
          <span class="specs-key">Rate of climb</span>
          <span class="specs-val"
            >7 m/s <span class="specs-alt">(1 378 ft/min)</span></span
          >
        </div>
        <div class="specs-row">
          <span class="specs-key">Stall speed VS0 (flaps)</span>
          <span class="specs-val"
            >≈ 90 km/h <span class="specs-alt">(48 kts)</span></span
          >
        </div>
        <div class="specs-row">
          <span class="specs-key">Approach speed VREF</span>
          <span class="specs-val"
            >75 km/h <span class="specs-alt">(41 kts)</span></span
          >
        </div>
        <div class="specs-row">
          <span class="specs-key">Takeoff / landing roll</span>
          <span class="specs-val">240 m / 150 m</span>
        </div>
        <div class="specs-row">
          <span class="specs-key">Glide ratio (L/D max)</span>
          <span class="specs-val"
            >18.6 <span class="specs-alt">(≈ 18 : 1)</span></span
          >
        </div>
      </div>
    </section>

    <!-- ===================== DETAILED SPECS ===================== -->
    <section class="section">
      <div class="sec-header">
        <div class="sec-label">Technical Data</div>
        <h2 class="sec-title">Complete specifications</h2>
        <p class="sec-sub">
          Detailed technical data for the ANG aircraft across all major systems.
        </p>
      </div>

      <div class="ds-grid">
        <!-- Weight & Loads -->
        <div class="ds-block">
          <div class="ds-heading">
            <span class="ds-icon">⚖️</span>
            <span class="ds-title">Weight & Loads</span>
          </div>
          <div class="specs-table">
            <div class="specs-row">
              <span class="specs-key">MTOW</span><span class="specs-val"
                >950 kg</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Empty weight</span><span class="specs-val"
                >380 kg</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Useful load</span><span class="specs-val"
                >up to 570 kg</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Fuel capacity</span><span
                class="specs-val"
                >up to 275 L <span class="specs-alt"
                  >(2 × 110 L + 55 L header tank)</span
                ></span
              >
            </div>
          </div>
        </div>

        <!-- Dimensions & Cabin -->
        <div class="ds-block">
          <div class="ds-heading">
            <span class="ds-icon">📐</span>
            <span class="ds-title">Dimensions & Cabin</span>
          </div>
          <div class="specs-table">
            <div class="specs-row">
              <span class="specs-key">Wingspan</span><span class="specs-val"
                >9.6 m</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Wing area</span><span class="specs-val"
                >10.8 m²</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Fuselage width</span><span
                class="specs-val">1.35 m</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Cabin height</span><span class="specs-val"
                >1.20 m</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Cabin width (shoulder)</span><span
                class="specs-val">1.33 m</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Cabin length (max)</span><span
                class="specs-val">2.30 m</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Baggage volume</span><span
                class="specs-val">780 L</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Overall length</span><span
                class="specs-val">7.31 m</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Overall height</span><span
                class="specs-val">2.70 m</span
              >
            </div>
          </div>
        </div>

        <!-- Engine & Propeller -->
        <div class="ds-block">
          <div class="ds-heading">
            <span class="ds-icon">🔧</span>
            <span class="ds-title">Engine & Propeller</span>
          </div>
          <div class="specs-table">
            <div class="specs-row">
              <span class="specs-key">Engine</span><span class="specs-val"
                >Rotax 916 iS — 160 hp <span class="specs-alt"
                  >(turbo, EFI)</span
                ></span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Fuel</span><span class="specs-val"
                >95/98 MOGAS & Avgas 100LL</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Typical consumption</span><span
                class="specs-val"
                >28 L/h <span class="specs-alt">(economy cruise)</span></span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Propeller</span><span class="specs-val"
                >3-blade carbon, in-flight variable pitch</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Pitch control</span><span
                class="specs-val"
                >Electric governor in spinner; manual & auto modes</span
              >
            </div>
          </div>
        </div>

        <!-- Avionics & Electrics -->
        <div class="ds-block">
          <div class="ds-heading">
            <span class="ds-icon">🖥️</span>
            <span class="ds-title">Avionics & Electrics</span>
          </div>
          <div class="specs-table">
            <div class="specs-row">
              <span class="specs-key">Glass cockpit</span><span
                class="specs-val"
                >2 × Garmin G3X Touch 10" + G5 backup + GMC 507</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Autopilot</span><span class="specs-val"
                >Integrated <span class="specs-alt">(via GMC 507)</span></span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Nav / Com</span><span class="specs-val"
                >VFR / IFR by configuration</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Electrical system</span><span
                class="specs-val"
                >Dual-bus / redundant <span class="specs-alt"
                  >(by configuration)</span
                ></span
              >
            </div>
          </div>
        </div>

        <!-- Flight Control System -->
        <div class="ds-block">
          <div class="ds-heading">
            <span class="ds-icon">🎛️</span>
            <span class="ds-title">Flight Control System</span>
          </div>
          <div class="specs-table">
            <div class="specs-row">
              <span class="specs-key">Actuators</span><span class="specs-val"
                >No cables or springs: composite pushrods & bellcranks</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Bearings</span><span class="specs-val"
                >Spherical bearings at all pivot points</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Control surfaces</span><span
                class="specs-val">Slotted, with horn & mass balance</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Elevator</span><span class="specs-val"
                >Two-section with turbulators for enhanced efficiency</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Elevator trim</span><span
                class="specs-val"
                >Electric on right section, stick-mounted control</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Rudder trim</span><span class="specs-val"
                >Adjustable tab for cruise balance</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Flaps</span><span class="specs-val"
                >Fuselage servo actuator, electronic control unit</span
              >
            </div>
          </div>
        </div>

        <!-- Landing Gear & Brakes -->
        <div class="ds-block">
          <div class="ds-heading">
            <span class="ds-icon">🛞</span>
            <span class="ds-title">Landing Gear & Brakes</span>
          </div>
          <div class="specs-table">
            <div class="specs-row">
              <span class="specs-key">Configuration</span><span
                class="specs-val"
                >Retractable tricycle (nose + mains, single-strut damper)</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Shock absorption</span><span
                class="specs-val">Oleo-pneumatic on all struts</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Nose-wheel steering</span><span
                class="specs-val">Pedal-linked; ±30° turn</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Wheels / tires</span><span
                class="specs-val"
                >Mitas 16 × 4 (4.00-8) 2PR B5 Super <span class="specs-alt"
                  >(all positions)</span
                ></span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Brakes</span><span class="specs-val"
                >Hydraulic disc on mains; differential from both seats</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Materials</span><span class="specs-val"
                >Cast wheels; composite nose fork & lever</span
              >
            </div>
          </div>
        </div>

        <!-- Fuel System -->
        <div class="ds-block">
          <div class="ds-heading">
            <span class="ds-icon">⛽</span>
            <span class="ds-title">Fuel System</span>
          </div>
          <div class="specs-table">
            <div class="specs-row">
              <span class="specs-key">Layout</span><span class="specs-val"
                >2 × 110 L wing-root tanks + 55 L header tank</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Total capacity</span><span
                class="specs-val"
                >Up to 275 L <span class="specs-alt">(excl. unusable)</span
                ></span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Feed</span><span class="specs-val"
                >Gravity to header tank + two boost pumps</span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">Construction</span><span class="specs-val"
                >Sandwich wing tanks (AEROGLASS + Divinycell foam); antistatic
                PE header tank</span
              >
            </div>
          </div>
        </div>

        <!-- Limitations -->
        <div class="ds-block">
          <div class="ds-heading">
            <span class="ds-icon">⚠️</span>
            <span class="ds-title">Limitations</span>
          </div>
          <div class="specs-table">
            <div class="specs-row">
              <span class="specs-key">G-load</span><span class="specs-val"
                >−2.0 … +4.0 g <span class="specs-alt">(up to 20 s)</span></span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">VS0 (flaps)</span><span class="specs-val"
                >90 km/h <span class="specs-alt">(48 kts)</span></span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">V2min (takeoff)</span><span
                class="specs-val"
                >90 km/h <span class="specs-alt">(48 kts)</span></span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">VREF (landing)</span><span
                class="specs-val"
                >75 km/h <span class="specs-alt">(41 kts)</span></span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">VFE (full flaps)</span><span
                class="specs-val"
                >130 km/h <span class="specs-alt">(70 kts)</span></span
              >
            </div>
            <div class="specs-row">
              <span class="specs-key">VLE (gear)</span><span class="specs-val"
                >130 km/h <span class="specs-alt">(70 kts)</span></span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== DOCUMENTATION ===================== -->
    <section class="section" id="docs">
      <div class="sec-header">
        <div class="sec-label">Documentation</div>
        <h2 class="sec-title">Essential manuals</h2>
        <p class="sec-sub">
          Download the core manuals to get familiar with your ANG aircraft.
        </p>
      </div>

      <div class="docs-grid">
        <a
          class="doc-card"
          href="/docs/Flight-Manual-ANG.pdf"
          target="_blank"
          rel="noopener"
        >
          <div class="doc-icon">✈️</div>
          <div class="doc-info">
            <div class="doc-name">ANG Flight Manual</div>
            <div class="doc-desc">
              Flight operations handbook — procedures, limitations, performance
              data and emergency checklists.
            </div>
          </div>
          <div class="doc-action">
            <span class="doc-badge">PDF</span>
            <span class="doc-arrow">↓</span>
          </div>
        </a>
        <a
          class="doc-card"
          href="/docs/ANG-BUild-Manual-5-4-25-2-1.docx"
          target="_blank"
          rel="noopener"
        >
          <div class="doc-icon">📘</div>
          <div class="doc-info">
            <div class="doc-name">ANG Build Manual</div>
            <div class="doc-desc">
              Complete assembly guide with step-by-step instructions, diagrams,
              and quality checkpoints. Updated 05-04-2025.
            </div>
          </div>
          <div class="doc-action">
            <span class="doc-badge">DOCX</span>
            <span class="doc-arrow">↓</span>
          </div>
        </a>
      </div>
    </section>

    <!-- ===================== OWNERSHIP MODELS ===================== -->
    <section class="section">
      <div class="sec-header">
        <div class="sec-label">Participation Models</div>
        <h2 class="sec-title">Choose your path</h2>
        <p class="sec-sub">
          From full ownership to tokenized participation — the ecosystem adapts
          to your goals.
        </p>
      </div>

      <div class="models-grid">
        <article class="model-card model-full">
          <div class="model-bg" aria-hidden="true"></div>
          <div class="model-icon">🛩</div>
          <div class="model-name">Full Ownership</div>
          <p class="model-text">
            Order, build, and register your own aircraft under the 51% rule.
            Full legal title, full control, full sky.
          </p>
          <ul class="model-list">
            <li>Complete legal ownership</li>
            <li>Custom configuration</li>
            <li>Build support included</li>
            <li>Private registration</li>
          </ul>
        </article>

        <article class="model-card">
          <div class="model-icon">🤝</div>
          <div class="model-name">Shared Access</div>
          <p class="model-text">
            Join a collective ownership structure. Split costs, share hours,
            keep full access to a professionally maintained aircraft.
          </p>
          <ul class="model-list">
            <li>Cost-efficient ownership</li>
            <li>Managed scheduling</li>
            <li>Maintenance covered</li>
            <li>Flexible exit options</li>
          </ul>
        </article>

        <article class="model-card">
          <div class="model-icon">🪙</div>
          <div class="model-name">Token Participation</div>
          <p class="model-text">
            Invest in the ANGT token and participate in the ecosystem's growth,
            rewards, and aviation asset revenue.
          </p>
          <ul class="model-list">
            <li>Tokenized aviation assets</li>
            <li>Staking rewards</li>
            <li>Liquidity pool access</li>
            <li>EU-market exposure</li>
          </ul>
        </article>
      </div>
    </section>

    <!-- ===================== INFRASTRUCTURE ===================== -->
    <section class="section">
      <div class="sec-header">
        <div class="sec-label">Hangar & Infrastructure</div>
        <h2 class="sec-title">Built on the ground, too</h2>
        <p class="sec-sub">
          Physical hangars, build support, operational workflows — all in
          Cyprus.
        </p>
      </div>

      <figure class="gal-main gal-solo">
        <img
          class="gal-img"
          src="/images/hangar-out.png"
          alt="Hangar exterior"
          loading="lazy"
        />
        <figcaption class="gal-cap">Hangar exterior · concept</figcaption>
      </figure>
    </section>

    <!-- ===================== PROCESS ===================== -->
    <section class="section" id="process">
      <div class="sec-header">
        <div class="sec-label">Guided Journey</div>
        <h2 class="sec-title">From order to flight</h2>
        <p class="sec-sub">
          Every stage is transparent, professionally managed, and supported by
          the platform.
        </p>
      </div>

      <div class="timeline">
        {#each steps as s, i}
          <div class="step" class:step-last={i === steps.length - 1}>
            <div class="step-num">{i + 1}</div>
            <div class="step-connector" aria-hidden="true"></div>
            <div class="step-body">
              <div class="step-icon">{s.icon}</div>
              <div class="step-name">{s.name}</div>
              <div class="step-desc">{s.desc}</div>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- ===================== CONFIGURATOR CTA ===================== -->
    <section class="section">
      <div class="cfg-card">
        <div class="cfg-bg" aria-hidden="true"></div>
        <div class="cfg-img-col">
          <img
            class="cfg-img"
            src="/images/main2.png"
            alt="Configure your aircraft"
            loading="lazy"
          />
        </div>
        <div class="cfg-content">
          <div class="sec-label">Digital Tool</div>
          <h2 class="cfg-title">Configure your aircraft online</h2>
          <p class="cfg-text">
            Select engine, avionics, interior, safety systems and paint. See
            live price and weight. Submit your order directly.
          </p>
          <div class="cfg-pills">
            <span class="pill">Engine</span>
            <span class="pill">Avionics</span>
            <span class="pill">Interior</span>
            <span class="pill">Safety</span>
            <span class="pill">Paint</span>
          </div>
          <a class="btn-primary" href="/configurator">Open Configurator →</a>
        </div>
      </div>
    </section>

    <!-- ===================== FINAL CTA ===================== -->
    <section class="section">
      <div class="final-cta">
        <div class="final-bg" aria-hidden="true"></div>
        <div class="final-content">
          <h2 class="final-title">Ready to own the sky?</h2>
          <p class="final-sub">
            Talk to our aviation team. We'll walk you through the build, the
            ownership structure, and the ecosystem.
          </p>
          <div class="final-actions">
            <a class="btn-primary" href="mailto:info@flyangt.com">Contact us</a>
            <a class="btn-ghost" href="/app/dashboard">Enter Hub</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</section>

<style>
  /* ========================
     BASE
  ======================== */
  .showroom {
    padding: 40px 16px 96px;
  }

  .wrap {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 80px;
  }

  /* ========================
     SHARED SECTION HEADERS
  ======================== */
  .section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .sec-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 760px;
  }

  .sec-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--accent);
  }

  .sec-title {
    margin: 0;
    font-size: 38px;
    font-weight: 600;
    letter-spacing: -0.02em;
    font-family: var(--font-heading);
    color: var(--text-main);
    line-height: 1.1;
  }

  .sec-sub {
    margin: 0;
    font-size: 15px;
    line-height: 1.75;
    color: var(--text-muted);
    max-width: 64ch;
  }

  /* ========================
     BUTTONS
  ======================== */
  .btn-primary,
  .btn-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    padding: 0 22px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    letter-spacing: 0.02em;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease,
      border-color 0.35s ease;
    white-space: nowrap;
  }

  .btn-primary {
    background: linear-gradient(
      135deg,
      rgba(176, 141, 87, 0.95),
      rgba(120, 86, 36, 0.92)
    );
    color: #fff;
    border: 1px solid rgba(176, 141, 87, 0.32);
    box-shadow:
      0 14px 36px rgba(176, 141, 87, 0.22),
      0 6px 16px rgba(18, 20, 22, 0.08);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow:
      0 22px 56px rgba(176, 141, 87, 0.28),
      0 8px 22px rgba(18, 20, 22, 0.1);
  }

  .btn-ghost {
    background: rgba(176, 141, 87, 0.07);
    color: rgba(120, 86, 36, 0.92);
    border: 1px solid rgba(176, 141, 87, 0.22);
  }

  .btn-ghost:hover {
    transform: translateY(-2px);
    border-color: rgba(176, 141, 87, 0.38);
    background: rgba(176, 141, 87, 0.12);
  }

  /* ========================
     HERO
  ======================== */
  .hero {
    position: relative;
    border-radius: 28px;
    overflow: hidden;
    min-height: 540px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    border: 1px solid var(--border-soft);
    box-shadow:
      0 40px 110px rgba(18, 20, 22, 0.12),
      0 12px 32px rgba(18, 20, 22, 0.08);
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      160deg,
      rgba(18, 20, 22, 0.72) 0%,
      rgba(18, 20, 22, 0.45) 50%,
      rgba(18, 20, 22, 0.18) 100%
    );
    z-index: 2;
  }

  .hero-img-wrap {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .hero-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      0deg,
      rgba(18, 20, 22, 0.8) 0%,
      rgba(18, 20, 22, 0.3) 50%,
      transparent 100%
    );
  }

  .hero-content {
    position: relative;
    z-index: 3;
    padding: 40px 40px 44px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 680px;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(10px);
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.9);
    width: fit-content;
  }

  .badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: var(--accent);
    box-shadow: 0 0 0 5px rgba(176, 141, 87, 0.28);
    flex-shrink: 0;
  }

  .hero-title {
    margin: 0;
    font-size: 58px;
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1;
    font-family: var(--font-heading);
    color: #ffffff;
  }

  .hero-sub {
    margin: 0;
    font-size: 16px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.82);
    max-width: 56ch;
  }

  .hero-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 6px;
  }

  /* ========================
     AIRCRAFT STATS
  ======================== */
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 18px;
    align-items: start;
  }

  .stat-card {
    border-radius: 28px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    overflow: hidden;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    align-items: stretch;
  }

  .stat-img-wrap {
    overflow: hidden;
    min-height: 320px;
  }

  .stat-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }

  .stat-card:hover .stat-img {
    transform: scale(1.04);
  }

  .stat-info {
    padding: 26px 22px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .stat-name {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text-main);
    font-family: var(--font-heading);
  }

  .stat-sub {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 14px;
  }

  .specs {
    display: grid;
    gap: 10px;
  }

  .spec {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-soft);
  }

  .spec:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .sk {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .sv {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-main);
    text-align: right;
  }

  .stat-cards-col {
    display: grid;
    gap: 12px;
  }

  .mini-card {
    border-radius: 22px;
    padding: 18px 18px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.07),
      0 6px 18px rgba(18, 20, 22, 0.05);
    transition: transform 0.35s ease;
  }

  .mini-card:hover {
    transform: translateY(-2px);
  }

  .accent-card {
    background: radial-gradient(
        600px 200px at 80% 0%,
        rgba(176, 141, 87, 0.14),
        transparent 60%
      ),
      var(--bg-white);
    border-color: rgba(176, 141, 87, 0.22);
  }

  .mc-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 6px;
  }

  .mc-value {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text-main);
    font-family: var(--font-heading);
    background: linear-gradient(
      135deg,
      var(--accent-light),
      var(--accent),
      var(--accent-dark)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .mc-hint {
    margin-top: 4px;
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 500;
  }

  /* ========================
     ABOUT ANG
  ======================== */
  .about-card {
    position: relative;
    border-radius: 28px;
    overflow: hidden;
    border: 1px solid rgba(176, 141, 87, 0.2);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    background: radial-gradient(
        900px 400px at 20% -40%,
        rgba(176, 141, 87, 0.12),
        transparent 60%
      ),
      var(--bg-white);
  }

  .about-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      600px 300px at 90% 100%,
      rgba(120, 86, 36, 0.06),
      transparent 60%
    );
  }

  .about-content {
    position: relative;
    z-index: 1;
    padding: 36px 34px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .about-text {
    margin: 0;
    font-size: 16px;
    line-height: 1.8;
    color: var(--text-muted);
    max-width: 80ch;
  }

  .highlights-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }

  .hl-item {
    padding: 20px 18px;
    border-radius: 20px;
    background: rgba(176, 141, 87, 0.06);
    border: 1px solid rgba(176, 141, 87, 0.16);
    text-align: center;
    transition: transform 0.35s ease;
  }

  .hl-item:hover {
    transform: translateY(-2px);
  }

  .hl-value {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.03em;
    font-family: var(--font-heading);
    background: linear-gradient(
      135deg,
      var(--accent-light),
      var(--accent),
      var(--accent-dark)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hl-label {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  /* ========================
     PERFORMANCE SPECS
  ======================== */
  .perf-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }

  .perf-card {
    border-radius: 22px;
    padding: 22px 18px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.07),
      0 6px 18px rgba(18, 20, 22, 0.05);
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
  }

  .perf-card:hover {
    transform: translateY(-3px);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.09),
      0 10px 24px rgba(18, 20, 22, 0.07);
  }

  .perf-main {
    background: radial-gradient(
        400px 200px at 80% 0%,
        rgba(176, 141, 87, 0.1),
        transparent 60%
      ),
      var(--bg-white);
    border-color: rgba(176, 141, 87, 0.22);
  }

  .perf-icon {
    font-size: 24px;
  }

  .perf-metric {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .perf-value {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.03em;
    font-family: var(--font-heading);
    color: var(--text-main);
  }

  .perf-unit {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
  }

  .perf-name {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .specs-table {
    border-radius: 22px;
    overflow: hidden;
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.07),
      0 6px 18px rgba(18, 20, 22, 0.05);
    background: var(--bg-white);
  }

  .specs-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 22px;
    border-bottom: 1px solid var(--border-soft);
    transition: background 0.25s ease;
  }

  .specs-row:last-child {
    border-bottom: none;
  }

  .specs-row:hover {
    background: rgba(176, 141, 87, 0.04);
  }

  .specs-key {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-main);
  }

  .specs-val {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-main);
    text-align: right;
  }

  .specs-alt {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
  }

  /* ========================
     DETAILED SPECS GRID
  ======================== */
  .ds-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }

  .ds-block {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .ds-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 22px;
    border-radius: 22px 22px 0 0;
    background: radial-gradient(
        500px 150px at 80% 0%,
        rgba(176, 141, 87, 0.1),
        transparent 60%
      ),
      var(--bg-white);
    border: 1px solid var(--border-soft);
    border-bottom: none;
  }

  .ds-icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .ds-title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text-main);
    font-family: var(--font-heading);
  }

  .ds-block .specs-table {
    border-radius: 0 0 22px 22px;
  }

  /* ========================
     DOCUMENTATION
  ======================== */
  .docs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }

  .doc-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 22px 24px;
    border-radius: 22px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.07),
      0 6px 18px rgba(18, 20, 22, 0.05);
    text-decoration: none;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease,
      border-color 0.35s ease;
  }

  .doc-card:hover {
    transform: translateY(-3px);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.09),
      0 10px 24px rgba(18, 20, 22, 0.07);
    border-color: rgba(176, 141, 87, 0.28);
  }

  .doc-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }

  .doc-info {
    flex: 1;
    min-width: 0;
  }

  .doc-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-main);
    font-family: var(--font-heading);
    margin-bottom: 4px;
  }

  .doc-desc {
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-muted);
  }

  .doc-action {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .doc-badge {
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(176, 141, 87, 0.1);
    border: 1px solid rgba(176, 141, 87, 0.2);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: rgba(120, 86, 36, 0.9);
  }

  .doc-arrow {
    width: 32px;
    height: 32px;
    border-radius: 999px;
    background: linear-gradient(
      135deg,
      rgba(176, 141, 87, 0.9),
      rgba(120, 86, 36, 0.88)
    );
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.35s ease;
  }

  .doc-card:hover .doc-arrow {
    transform: translateY(2px);
  }

  /* ========================
     OWNERSHIP MODELS
  ======================== */
  .models-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .model-card {
    position: relative;
    border-radius: 28px;
    padding: 28px 26px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: hidden;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
  }

  .model-card:hover {
    transform: translateY(-3px);
    box-shadow:
      0 44px 120px rgba(18, 20, 22, 0.1),
      0 12px 30px rgba(18, 20, 22, 0.08);
  }

  .model-full {
    background: radial-gradient(
        800px 400px at 80% -30%,
        rgba(176, 141, 87, 0.13),
        transparent 65%
      ),
      var(--bg-white);
    border-color: rgba(176, 141, 87, 0.2);
  }

  .model-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .model-icon {
    width: 48px;
    height: 48px;
    border-radius: 18px;
    background: rgba(176, 141, 87, 0.1);
    border: 1px solid rgba(176, 141, 87, 0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }

  .model-name {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
    font-family: var(--font-heading);
    background: linear-gradient(
      135deg,
      var(--accent-light),
      var(--accent),
      var(--accent-dark)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .model-text {
    margin: 0;
    font-size: 14px;
    line-height: 1.75;
    color: var(--text-muted);
  }

  .model-list {
    margin: 4px 0 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 8px;
  }

  .model-list li {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-main);
    padding-left: 18px;
    position: relative;
  }

  .model-list li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 7px;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--accent);
  }

  /* ========================
     GALLERY
  ======================== */
  .gallery {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    grid-template-rows: auto auto;
    gap: 14px;
  }

  .gal-solo {
    grid-column: 1 / -1;
    grid-row: auto;
    max-height: 500px;
  }

  .gal-solo .gal-img {
    min-height: 400px;
    max-height: 460px;
  }

  .gal-main {
    grid-row: 1;
    grid-column: 1;
    border-radius: 28px;
    overflow: hidden;
    margin: 0;
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    background: var(--bg-white);
  }

  .gal-col {
    grid-row: 1;
    grid-column: 2;
    display: grid;
    gap: 14px;
  }

  .gal-wide {
    grid-column: 1 / -1;
    border-radius: 28px;
    overflow: hidden;
    margin: 0;
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    background: var(--bg-white);
  }

  .gal-sm {
    border-radius: 22px;
    overflow: hidden;
    margin: 0;
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.07),
      0 6px 18px rgba(18, 20, 22, 0.05);
    background: var(--bg-white);
  }

  .gal-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    min-height: 200px;
    transition: transform 0.6s ease;
  }

  .gal-main .gal-img {
    min-height: 340px;
  }
  .gal-wide .gal-img {
    min-height: 280px;
  }

  .gal-main:hover .gal-img,
  .gal-wide:hover .gal-img,
  .gal-sm:hover .gal-img {
    transform: scale(1.03);
  }

  .gal-cap {
    display: block;
    padding: 10px 14px;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
    border-top: 1px solid var(--border-soft);
    background: var(--bg-white);
  }

  /* ========================
     PROCESS TIMELINE
  ======================== */
  .timeline {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 14px;
  }

  .step {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .step-num {
    width: 36px;
    height: 36px;
    border-radius: 999px;
    background: linear-gradient(
      135deg,
      rgba(176, 141, 87, 0.18),
      rgba(120, 86, 36, 0.12)
    );
    border: 1px solid rgba(176, 141, 87, 0.32);
    color: rgba(120, 86, 36, 0.92);
    font-size: 13px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    flex-shrink: 0;
  }

  .step-connector {
    position: absolute;
    top: 18px;
    left: 50%;
    right: -50%;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(176, 141, 87, 0.3),
      rgba(176, 141, 87, 0.1)
    );
    z-index: 1;
  }

  .step-last .step-connector {
    display: none;
  }

  .step-body {
    margin-top: 14px;
    border-radius: 22px;
    padding: 18px 16px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.07),
      0 6px 18px rgba(18, 20, 22, 0.05);
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
  }

  .step-body:hover {
    transform: translateY(-3px);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.09),
      0 10px 24px rgba(18, 20, 22, 0.07);
  }

  .step-icon {
    font-size: 22px;
  }

  .step-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: -0.01em;
  }

  .step-desc {
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-muted);
    font-weight: 500;
  }

  /* ========================
     CONFIGURATOR CTA
  ======================== */
  .cfg-card {
    position: relative;
    border-radius: 28px;
    overflow: hidden;
    border: 1px solid var(--border-soft);
    box-shadow:
      0 40px 110px rgba(18, 20, 22, 0.1),
      0 12px 32px rgba(18, 20, 22, 0.07);
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    background: var(--bg-white);
  }

  .cfg-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      900px 400px at 80% 50%,
      rgba(176, 141, 87, 0.1),
      transparent 65%
    );
  }

  .cfg-img-col {
    overflow: hidden;
    min-height: 360px;
  }

  .cfg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }

  .cfg-card:hover .cfg-img {
    transform: scale(1.04);
  }

  .cfg-content {
    position: relative;
    z-index: 1;
    padding: 36px 34px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    justify-content: center;
  }

  .cfg-title {
    margin: 0;
    font-size: 34px;
    font-weight: 600;
    letter-spacing: -0.02em;
    font-family: var(--font-heading);
    color: var(--text-main);
    line-height: 1.15;
  }

  .cfg-text {
    margin: 0;
    font-size: 15px;
    line-height: 1.75;
    color: var(--text-muted);
  }

  .cfg-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .pill {
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(176, 141, 87, 0.24);
    background: rgba(176, 141, 87, 0.08);
    color: rgba(120, 86, 36, 0.9);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
  }

  /* ========================
     FINAL CTA
  ======================== */
  .final-cta {
    position: relative;
    border-radius: 28px;
    overflow: hidden;
    border: 1px solid rgba(176, 141, 87, 0.2);
    box-shadow:
      0 40px 110px rgba(18, 20, 22, 0.1),
      0 12px 32px rgba(18, 20, 22, 0.07);
    background: radial-gradient(
        900px 460px at 20% -80%,
        rgba(176, 141, 87, 0.15),
        transparent 60%
      ),
      radial-gradient(
        700px 380px at 80% 120%,
        rgba(120, 86, 36, 0.1),
        transparent 60%
      ),
      var(--bg-white);
  }

  .final-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .final-content {
    position: relative;
    z-index: 1;
    padding: 56px 48px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .final-title {
    margin: 0;
    font-size: 48px;
    font-weight: 600;
    letter-spacing: -0.03em;
    font-family: var(--font-heading);
    background: linear-gradient(
      135deg,
      var(--accent-light),
      var(--accent),
      var(--accent-dark)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .final-sub {
    margin: 0;
    font-size: 16px;
    line-height: 1.75;
    color: var(--text-muted);
    max-width: 60ch;
  }

  .final-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 6px;
  }

  /* ========================
     RESPONSIVE
  ======================== */
  @media (max-width: 1100px) {
    .stats-grid {
      grid-template-columns: 1fr 240px;
    }
  }

  @media (max-width: 980px) {
    .wrap {
      gap: 64px;
    }

    .hero-title {
      font-size: 42px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stat-card {
      grid-template-columns: 1fr 1fr;
    }

    .highlights-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .perf-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .ds-grid {
      grid-template-columns: 1fr;
    }

    .docs-grid {
      grid-template-columns: 1fr;
    }

    .models-grid {
      grid-template-columns: 1fr;
    }

    .gallery {
      grid-template-columns: 1fr;
    }

    .gal-col {
      grid-column: 1;
      grid-row: auto;
      grid-template-columns: 1fr 1fr;
    }

    .gal-main,
    .gal-wide {
      grid-column: 1;
    }

    .timeline {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .step-connector {
      display: none;
    }

    .cfg-card {
      grid-template-columns: 1fr;
    }

    .cfg-img-col {
      min-height: 280px;
    }

    .sec-title {
      font-size: 30px;
    }
  }

  @media (max-width: 640px) {
    .showroom {
      padding: 24px 12px 72px;
    }
    .wrap {
      gap: 52px;
    }

    .hero {
      min-height: 400px;
    }
    .hero-content {
      padding: 24px 20px 28px;
    }
    .hero-title {
      font-size: 30px;
    }
    .hero-sub {
      font-size: 14px;
    }

    .stat-card {
      grid-template-columns: 1fr;
    }
    .stat-img-wrap {
      min-height: 220px;
    }

    .highlights-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .hl-value {
      font-size: 22px;
    }

    .about-content {
      padding: 24px 20px;
    }

    .perf-grid {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .perf-value {
      font-size: 22px;
    }

    .specs-row {
      padding: 12px 16px;
    }
    .specs-key {
      font-size: 13px;
    }
    .specs-val {
      font-size: 13px;
    }

    .ds-heading {
      padding: 12px 16px;
    }
    .ds-title {
      font-size: 14px;
    }

    .doc-card {
      flex-direction: column;
      align-items: flex-start;
      padding: 18px 16px;
      gap: 12px;
    }

    .doc-action {
      align-self: flex-end;
    }

    .timeline {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .cfg-content {
      padding: 24px 20px;
    }
    .cfg-title {
      font-size: 24px;
    }

    .final-content {
      padding: 36px 20px;
    }
    .final-title {
      font-size: 32px;
    }

    .sec-title {
      font-size: 26px;
    }
  }
</style>
