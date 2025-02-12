<script lang="ts">
	import '../app.postcss';
  import { LightSwitch } from '@skeletonlabs/skeleton';
	let { children } = $props();
</script>

<div class="absolute top-0 right-0 p-4">
	<LightSwitch />
</div>

<div class="flex items-center justify-center min-h-screen">
	{@render children()}
</div>

<style>

</style>