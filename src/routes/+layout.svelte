<script lang="ts">
  import '../app.postcss';
  import { LightSwitch } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import ConnectionStatus from '$lib/components/ConnectionStatus.svelte';

	// Inicializar stores globales de Skeleton UI
	initializeStores();

	let { children } = $props();
</script>

<div class="absolute top-0 right-0 p-4">
	<LightSwitch />
</div>

<div class="flex items-center justify-center min-h-screen">
	{@render children()}
</div>

<div class="absolute bottom-0 left-0 p-4">
	<ConnectionStatus />
</div>
