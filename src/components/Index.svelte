<script lang="ts">
  import Hero from "../components/index/Hero.svelte";
  import HomePosts from "./index/HomePosts.svelte";
  import PathSelector from "./index/PathSelector.svelte";

  export let data: any;
</script>

<Hero />
<PathSelector />
<HomePosts {data} />
