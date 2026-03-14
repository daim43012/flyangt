<!-- src/sections/TeamSection.svelte -->
<script lang="ts">
  type TeamMember = {
    name: string;
    role: string;
    bio: string;
    photo: string; // /images/team/...
    focus?: string; // CSS object-position (e.g. "50% 20%")
  };

  const team: TeamMember[] = [
    {
      name: "Artem Prokopenko",
      role: "CEO",
      bio: "Founder and CEO. Product vision, partnerships, and go to market.",
      photo: "/images/team/Artem.jpg",
      focus: "50% 18%"
    },
    {
      name: "Vladimir Morgunov",
      role: "Director of Production & Chief Pilot",
      bio: "Major General of Aviation. Production director and chief pilot.",
      photo: "/images/team/Morgunov.jpg",
      focus: "50% 18%"
    },
    {
      name: "Vladimir Gatsko",
      role: "CTO",
      bio: "Token architecture, utility design, and on chain integrations.",
      photo: "/images/team/Gatsko.jpg",
      focus: "50% 20%"
    },
    {
      name: "Liia Khatkova",
      role: "Head of Communications",
      bio: "Brand, content, and community growth across the ecosystem.",
      photo: "/images/team/Liya.png",
      focus: "50% 18%"
    },
    {
      name: "Andrey Sakhno",
      role: "Business Development",
      bio: "Partnerships, sales pipeline, and customer acquisition strategy.",
      photo: "/images/team/Sakhno.jpg",
      focus: "50% 18%"
    },
    {
      name: "Oleksiy Shevchenko",
      role: "Chief Delivery Officer, Head of PMO",
      bio: "Delivery management, planning, execution control, and PMO processes.",
      photo: "/images/team/Oleksiy.png",
      focus: "50% 18%"
    }
  ];
</script>

<section class="team" id="team">
  <div class="team-header">
    <h2 class="team-title">The team behind FlyANG</h2>
    <p class="team-subtitle">Aviation, production, and platform execution</p>
    <p class="team-lead">
      Specialists across operations, engineering, delivery, and ecosystem design.
      Clear roles, accountable ownership, and long term execution.
    </p>
  </div>

  <div class="team-grid">
    {#each team as m (m.name)}
      <article class="team-card">
        <div class="team-photoWrap">
          <img
            class="team-photo"
            src={m.photo}
            srcset={`${m.photo} 1x, ${m.photo} 2x`}
            sizes="(max-width: 560px) 92vw, (max-width: 980px) 45vw, 360px"
            alt={m.name}
            loading="lazy"
            decoding="async"
            style={`object-position: ${m.focus ?? "50% 18%"};`}
          />
          <div class="team-photoShade" aria-hidden="true"></div>
        </div>

        <div class="team-body">
          <div class="team-name" title={m.name}>{m.name}</div>
          <div class="team-role">{m.role}</div>
          <div class="team-bio">{m.bio}</div>
        </div>
      </article>
    {/each}
  </div>
</section>

<style>
  .team {
    padding: 120px 16px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .team-header {
    text-align: center;
    margin-bottom: 70px;
  }

  .team-title {
    font-size: 44px;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .team-subtitle {
    margin-top: 16px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .team-lead {
    margin: 28px auto 0;
    max-width: 70ch;
    font-size: 16px;
    line-height: 1.75;
    color: var(--text-muted);
  }

  /* GRID */
  .team-grid {
    margin-top: 60px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 28px;
  }

  /* CARD */
  .team-card {
    border-radius: 28px;
    overflow: hidden;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18,20,22,0.08),
      0 8px 22px rgba(18,20,22,0.06);
    transition: transform 0.35s ease, box-shadow 0.35s ease;
    display: flex;
    flex-direction: column;
  }

  .team-card:hover {
    transform: translateY(-4px);
    box-shadow:
      0 40px 110px rgba(18,20,22,0.10),
      0 10px 28px rgba(18,20,22,0.08);
  }

  /* PHOTO */
  .team-photoWrap {
    position: relative;
    aspect-ratio: 4 / 3;
    min-height: 200px;
    overflow: hidden;
    background: rgba(15, 23, 42, 0.03);
  }

  .team-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transform: translateZ(0);
    backface-visibility: hidden;
  }

  .team-photoShade {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(120% 80% at 20% 0%, rgba(37, 99, 235, 0.18), transparent 55%),
      linear-gradient(to top, rgba(15, 23, 42, 0.18), transparent 55%);
    pointer-events: none;
    opacity: 0.55;
    transition: opacity 0.35s ease;
  }

  .team-card:hover .team-photoShade {
    opacity: 0.75;
  }

  /* BODY */
  .team-body {
    padding: 18px 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .team-name {
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.01em;

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

    transition: transform 0.35s ease;
  }

  .team-card:hover .team-name {
    transform: translateX(3px);
  }

  .team-role {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .team-bio {
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .team-title {
      font-size: 34px;
    }

    .team-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 720px) {
    .team {
      padding: 80px 16px;
    }

    .team-title {
      font-size: 26px;
    }

    .team-card {
      border-radius: 22px;
    }

    .team-grid {
      grid-template-columns: 1fr;
    }

    .team-photoWrap {
      min-height: 180px;
    }

    .team-name {
      font-size: 18px;
    }
  }
</style>