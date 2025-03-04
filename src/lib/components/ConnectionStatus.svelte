<script lang="ts">
	import { page } from "$app/state";
	import { tick } from "svelte";
  import { LightSwitch } from '@skeletonlabs/skeleton';
	import { checkConnection } from "$lib/services/tmdb";
	import { CircleChevronDown } from "lucide-svelte";

  let serverStatus = $state<'connected' | 'disconnected'>('disconnected');
  let dbStatus = $state<'connected' | 'disconnected'>('disconnected');  
  let tmdbStatus = $state<string | null>(null); 
  let showConnectionStatus = $state<boolean>(false);

  async function checkServerStatus() {
    try {
      // const response = await fetch('/api/user');
      const response = await fetch('/api/user', {
        credentials: 'same-origin'
      });
      console.log('Response status connection:', response.status);
      serverStatus = response.ok ? 'connected' : 'disconnected';
    } catch {
      serverStatus = 'disconnected';
    }
  }

  async function checkDbStatus() {
    try {
      const response = await fetch('/api/db-status');
      const data = await response.json();
      dbStatus = data.dbStatus;
    } catch {
      dbStatus = 'disconnected';
    }
  }

  async function checkTmdbStatus() {
    try {
      tmdbStatus = await checkConnection();
    } catch {
      tmdbStatus = 'disconnected';
    }
  }

  function toggleConnectionStatus() {
    showConnectionStatus = !showConnectionStatus;
  }
    
  $effect(() => {
    checkTmdbStatus();
    if (page.data.user) {
      checkServerStatus();
    }
    checkDbStatus();
  });
</script>

<!-- <LightSwitch /> -->

<!-- <div class="connection-status {showConnectionStatus ? 'collapsed' : ''}" class:show={showConnectionStatus}> -->
<!-- <div class="connection-status {showConnectionStatus ? '' : 'collapsed'}"> -->
<div class="connection-status bg-surface-800 border-surface-700 hover:border-surface-600 border-[1px] p-4 m-2 {showConnectionStatus ? 'collapsed' : ''}">
  <!-- TODO: Hacer que el botón abra y cierre todo el bloque de connection-status -->
  <div class="absolute right-0 bottom-0">    
    <button class="btn-showStatus text-primary-700 hover:text-primary-500" title="Estado de conexiones" onclick={toggleConnectionStatus}>
      <CircleChevronDown strokeWidth={1.25} size={26} stroke="currentColor"/>
    </button>
  </div>
  <!-- <p>@: {page.data.user?.username}</p> -->
  <div class="status-item status_tmdb">
    <span class="label">TMDB API:</span>
    <span class="indicator {tmdbStatus === 'connected' ? 'text-green-500' : 'text-red-500'}">
      {tmdbStatus}
    </span>
  </div>
  <div class="status-item status_server">
    <span class="label">User status:</span>
    <span class="indicator {serverStatus === 'connected' ? 'text-green-500' : 'text-red-500'}">
      {serverStatus}
    </span>
  </div>
  <div class="status-item status_aws">
    <span class="label">AWS DB:</span>
    <span class="indicator {dbStatus === 'connected' ? 'text-green-500' : 'text-red-500'}">
      {dbStatus}
    </span>
  </div>
    <!-- TODO: Reubicar este switch -->

</div>

<style>
  .connection-status {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 8px 40px 8px 12px;
    /* background: rgba(22, 22, 22, 0.5); */
    /* border: 1px solid rgb(34, 34, 34); */
    border-radius: 0.375rem;
    color: white;
    font-size: 0.875rem;
  }
  .btn-showStatus {
    padding: 6px;
    transition: transform 200ms;
  }

  .connection-status.collapsed {
    height: 40px;
    padding: 8px;
    width: 40px;
  }
  .connection-status.collapsed .btn-showStatus {
    transform: rotate(180deg);
  }




  /* .connection-status.show {
    opacity: 1;
  } */

  /* .connection-status:not(.show) {
    opacity: 0;
    pointer-events: none;
  } */

  .status-item {
    align-items: center;
    gap: 0.5rem;
  }

  .indicator {
    text-transform: capitalize;
  }

  .status_tmdb, .status_server, .status_aws {
    display: flex;  
  }

  .collapsed .status_tmdb,
  .collapsed .status_server,
  .collapsed .status_aws {    
    display: none;    
  }

  /* .indicator.connected {
    color: #4ade80;
  }

  .indicator.disconnected {
    color: #f87171;
  } */
</style>
