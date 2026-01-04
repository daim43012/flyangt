<script lang="ts">
  import Post from "../../../../components/publicPages/Post.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<Post {data} />
