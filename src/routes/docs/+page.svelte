<svelte:head>
  <title>FlyANGT API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</svelte:head>

<div id="swagger-ui"></div>

<svelte:window on:load={init} />

<script>
  import { onMount } from "svelte";

  onMount(async () => {
    init();
  });

  function init() {
    if (typeof window === "undefined") return;

    const script = document.createElement("script");
    script.src = "https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js";
    script.onload = () => {
      window.SwaggerUIBundle({
        url: "/openapi.yaml",
        dom_id: "#swagger-ui",
        presets: [window.SwaggerUIBundle.presets.apis, window.SwaggerUIBundle.SwaggerUIStandalonePreset],
        layout: "BaseLayout",
        deepLinking: true,
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 2,
        tryItOutEnabled: true,
      });
    };
    document.head.appendChild(script);
  }
</script>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
  #swagger-ui {
    min-height: 100vh;
  }
</style>
