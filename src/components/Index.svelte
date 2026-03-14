<script lang="ts">
  import Hero from "../components/index/Hero.svelte";
  import TestBlender from "./App/testBlender.svelte";
  import CyprusHub from "./index/CyprusHub.svelte";
  import HomePosts from "./index/HomePosts.svelte";
  import PathSelector from "./index/PathSelector.svelte";
  import PerformanceComparisonSection from "./index/PerformanceComparisonSection.svelte";
  import Plane from "./index/Plane.svelte";
  import Why from "./index/Why.svelte";
  import PlanePath from "./PlanePath.svelte";
  import FlightRoutesMap from "./publicPages/FlightRoutesMap.svelte";
  export let data: any;
</script>

<Hero />
<!-- <Plane /> -->
<Why/>
<CyprusHub/>
<PathSelector />
<PerformanceComparisonSection/>
<FlightRoutesMap/>
<PlanePath />
<HomePosts {data} />

<!-- <TestBlender /> -->
