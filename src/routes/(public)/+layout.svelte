<script >
  import Header from '../../components/Header.svelte';
  import Footer from '../../components/Footer.svelte';
</script>

<div class="public-layout">
  <Header />

  <main class="public-content">
    <slot />
  </main>

  <Footer />
</div>

<style>
  .public-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(
      180deg,
      #f8fafc 0%,
      #ffffff 40%,
      #ffffff 100%
    );
  }

  .public-content {
    flex: 1;
  }
</style>
