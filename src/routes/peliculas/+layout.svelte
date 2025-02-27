<script lang="ts">
	import { page } from '$app/state';
	import { checkConnection } from '$lib/services/tmdb';
  import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';

 

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos
        refetchOnWindowFocus: false,
      },
    },
  });

  let { children } = $props();

</script>

<QueryClientProvider client={queryClient}>
  {@render children()}
</QueryClientProvider>