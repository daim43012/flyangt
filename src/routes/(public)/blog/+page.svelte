<script lang="ts">
  import Blog from "../../../components/publicPages/Blog.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<Blog {data} />
