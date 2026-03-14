<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { openAdvisor } from "$lib/stores/advisor";

  onMount(() => {
    openAdvisor();
    goto("/app/dashboard", { replaceState: true });
  });
</script>
