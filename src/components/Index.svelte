<script lang="ts">
  import Hero from "../components/index/Hero.svelte";
  import HomePosts from "./index/HomePosts.svelte";
  import PathSelector from "./index/PathSelector.svelte";
  import Roadmap from "./index/Roadmap.svelte";

  export let data: any;
</script>

<Hero />
<PathSelector />
<Roadmap />
<HomePosts {data} />
