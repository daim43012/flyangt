<section class="hero">
  <div class="hero-top">
    <h1 class="hero-title">FLYANGT</h1>
    <div class="hero-subtitle">
      UNIFIED AVIATION OWNERSHIP INFRASTRUCTURE
    </div>
  </div>

  <div class="hero-media">
    <div class="media-frame">
      <video
        class="hero-video"
        src="/video/plane.mp4"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
      ></video>

      <div class="media-overlay"></div>

    </div>
  </div>
</section>

<style>
  .hero {
    padding: 48px 16px 24px;
  }

  .hero-top {
    text-align: center;
    margin-bottom: 20px;
  }

  .hero-title {
    font-size: 56px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    margin: 0;
    color: #0f172a;
  }

  .hero-subtitle {
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  .hero-media {
    display: flex;
    justify-content: center;
  }

  .media-frame {
    width: min(980px, 100%);
    position: relative;
    border-radius: 26px;
    overflow: hidden;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 24px 80px rgba(15, 23, 42, 0.10),
      0 10px 26px rgba(15, 23, 42, 0.08);
  }

  .media-frame::before {
    content: "";
    display: block;
    padding-top: 44%;
  }

  .hero-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .media-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.05),
        rgba(15, 23, 42, 0.18)
      );
  }

  .media-frame:hover .hero-video {
    transform: scale(1.04);
    transition: transform 0.6s ease;
  }

  @media (max-width: 720px) {
    .hero {
      padding-top: 36px;
    }

    .hero-title {
      font-size: 38px;
    }

    .hero-subtitle {
      font-size: 10px;
      letter-spacing: 0.22em;
    }

    .media-frame {
      border-radius: 20px;
    }

    .media-frame::before {
      padding-top: 62%;
    }

  }
</style>
