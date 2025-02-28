<script lang="ts">
	import { goto } from "$app/navigation";
	import { UserRound } from "lucide-svelte";
  import type { User } from '$lib/types';
	import { userStore} from '$lib/stores/userStore';

    
  let user: User | null;
  userStore.subscribe((value) => user = value); // Reactividad automática

  function userInfo() {
    goto("/messages");
  }

</script>

<div class="absolute user-button bg-surface-800  border-surface-700 hover:border-surface-600 border-[1px] rounded-md m-2">    
  <button class="flex flex-row items-center p-[6px] text-primary-700 hover:text-primary-500 group" title="Datos de usuario" onclick={userInfo}>
    {#if user}
      <UserRound strokeWidth={1.25} size={26} stroke="currentColor"/>            
      <span class="overflow-hidden max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 group-hover:mr-2">
        <!-- {user.fullName} / -->
        @{user.username}
      </span>          
    {:else}
      <UserRound strokeWidth={1.25} size={26} stroke="currentColor"/>    
      <span class="overflow-hidden ml-2">
        Iniciar sesión
      </span>      
    {/if}
  </button>
</div>

<style>
  .user-button {
    left: 1rem;
  }
  /* .logout-button button {
    padding: 6px;
  } */
</style>