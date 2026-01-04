<script lang="ts">
  import type { PageData } from "./$types";
  import Index from "../../components/Index.svelte";

  export let data: PageData;
</script>

<Index {data} />
