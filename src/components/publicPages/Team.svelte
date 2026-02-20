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
      photo: "/images/team/Khatkova.jpg",
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
      name: "Oleksiy",
      role: "Chief Delivery Officer, Head of PMO",
      bio: "Delivery management, planning, execution control, and PMO processes.",
      photo: "/images/team/Oleksiy.png",
      focus: "50% 18%"
    }
  ];
</script>

<section class="team" id="team">
  <div class="team-head">
    <h2 class="team-title">TEAM</h2>
    <p class="team-subtitle">The people building the ANGT ecosystem.</p>
  </div>

  <div class="grid">
    {#each team as m (m.name)}
      <article class="card">
        <div class="photo-wrap">
          <!--
            Важно для чёткости:
            1) не растягиваем маленькие изображения
            2) просим браузер брать 2x, если есть
            3) задаём aspect-ratio и фиксируем кадрирование через object-position
          -->
          <img
            class="photo"
            src={m.photo}
            srcset={`${m.photo} 1x, ${m.photo} 2x`}
            sizes="(max-width: 560px) 92vw, (max-width: 900px) 45vw, 320px"
            alt={m.name}
            loading="lazy"
            decoding="async"
            style={`object-position: ${m.focus ?? "50% 18%"};`}
          />
          <div class="photo-shade" aria-hidden="true"></div>
        </div>

        <div class="body">
          <div class="name" title={m.name}>{m.name}</div>
          <div class="role">{m.role}</div>
          <div class="bio">{m.bio}</div>
        </div>
      </article>
    {/each}
  </div>
</section>
<style>
.team {
  padding: 72px 16px 72px;
  max-width: 1200px;
  margin: 0 auto;
  color: #0f172a;
}

  .team-head {
    text-align: center;
    margin-bottom: 36px;
  }

  .team-title {
    font-size: 34px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    margin: 0;
    color: #0f172a;
  }

  .team-subtitle {
    margin-top: 10px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  /* GRID */
.grid {
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

  /* CARD */
  .card {
    border-radius: 28px;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.05);
    box-shadow:
      0 20px 70px rgba(15, 23, 42, 0.08),
      0 8px 22px rgba(15, 23, 42, 0.05);
    overflow: hidden;
    transition: transform 180ms ease, box-shadow 180ms ease;
    display: flex;
    flex-direction: column;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow:
      0 28px 90px rgba(15, 23, 42, 0.10),
      0 12px 28px rgba(15, 23, 42, 0.07);
  }

  /* PHOTO — ДЕЛАЕМ ДОМИНИРУЮЩИМ */
  .photo-wrap {
    position: relative;
    aspect-ratio: 4 / 5;        /* Вертикальный, более “executive” формат */
    min-height: 340px;          /* Выше чем было */
    overflow: hidden;
    background: rgba(15, 23, 42, 0.03);
  }

  .photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 20%;   /* Лица чуть выше центра */
    display: block;

    transform: translateZ(0);
    backface-visibility: hidden;
  }

  /* Лёгкий авиационный градиент */
  .photo-shade {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(120% 80% at 20% 0%, rgba(56, 189, 248, 0.18), transparent 55%),
      linear-gradient(to top, rgba(15, 23, 42, 0.18), transparent 55%);
    pointer-events: none;
    opacity: 0.55;
    transition: opacity 180ms ease;
  }

  .card:hover .photo-shade {
    opacity: 0.75;
  }

  /* BODY — КОМПАКТНЕЕ */
  .body {
    padding: 16px 18px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px; /* Меньше воздуха */
  }

  .name {
    font-size: 14px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.01em;
    color: #0f172a;
  }

  .role {
    font-size: 12px;
    font-weight: 800;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .bio {
    font-size: 12.5px;
    line-height: 1.45;
    color: #64748b;

    display: -webkit-box;
    -webkit-line-clamp: 2;   /* максимум 2 строки */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* RESPONSIVE */

  @media (max-width: 980px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 560px) {
    .team {
      padding: 60px 14px 80px;
    }

    .team-title {
      font-size: 24px;
      letter-spacing: 0.08em;
    }

    .grid {
      grid-template-columns: 1fr;
    }

    .photo-wrap {
      min-height: 300px;
    }
  }
</style>