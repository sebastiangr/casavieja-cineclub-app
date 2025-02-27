<script lang="ts">
	import { page } from "$app/state";
	import { tick } from "svelte";
  import { LightSwitch } from '@skeletonlabs/skeleton';

  let serverStatus = $state<'connected' | 'disconnected'>('disconnected');
  let dbStatus = $state<'connected' | 'disconnected'>('disconnected');  

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
    
  $effect(() => {
    if (page.data.user) {
      checkServerStatus();
    }
    checkDbStatus();
  });
</script>

<div class="connection-status">
  <!-- TODO: Reubicar este switch -->
  <LightSwitch />
  <p>@: {page.data.user?.username}</p>
  <div class="status-item">
    <span class="label">Server:</span>
    <span class="indicator {serverStatus === 'connected' ? 'text-green-500' : 'text-red-500'}">
      {serverStatus}
    </span>
  </div>
  <div class="status-item">
    <span class="label">Database:</span>
    <span class="indicator {dbStatus === 'connected' ? 'text-green-500' : 'text-red-500'}">
      {dbStatus}
    </span>
  </div>
</div>

<style>
  .connection-status {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 0.25rem;
    color: white;
    font-size: 0.875rem;
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .indicator {
    text-transform: capitalize;
  }

  /* .indicator.connected {
    color: #4ade80;
  }

  .indicator.disconnected {
    color: #f87171;
  } */
</style>
