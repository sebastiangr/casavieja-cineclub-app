<script lang="ts">
  import LogoutButton from '$lib/components/LogoutButton.svelte';
	import type { User } from '$lib/types';
	import { userStore} from '$lib/stores/userStore';
	import { LightSwitch } from '@skeletonlabs/skeleton';
  import { LogIn } from 'lucide-svelte';
    
  let user: User | null;
  userStore.subscribe((value) => user = value); // Reactividad automática
</script>

<header class="absolute flex justify-between items-center w-full h-20 pl-8 pr-8 text-white">
  {#if user}
    <div class="flex items-center mr-4">
      <div class="relative">
        <img
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.fullName}`}          
          alt="User Avatar"
          class="rounded-full w-12 h-12 object-cover"
        />
      </div>
      <div class="text-left pl-3">      
        <h2 class="text-lg font-bold">{user.fullName}</h2>
        <p class="text-sm text-gray-600">@{user.username}</p>
      </div>
    </div>
  {:else}
    <!-- TODO: Volver componente -->
    <button type="button" class="btn btn-sm variant-filled-primary">
      <LogIn strokeWidth={1.25} />
      Iniciar sesión
    </button>
  {/if}

  <!-- TODO: Reubicar este switch -->
  <LightSwitch />

  {#if user}
    <LogoutButton />
  {/if}
</header>

