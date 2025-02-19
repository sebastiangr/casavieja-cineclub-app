<script lang="ts">
  let serverStatus = $state<'connected' | 'disconnected'>('disconnected');
  let dbStatus = $state<'connected' | 'disconnected'>('disconnected');  

  async function checkServerStatus() {
    try {
      const response = await fetch('/api/user');
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
    checkServerStatus();
    checkDbStatus();
  });
</script>

<div class="connection-status">
  <div class="status-item">
    <span class="label">Server:</span>
    <!-- <span class="indicator {serverStatus}">{serverStatus}</span> -->
    <span class="indicator {serverStatus === 'connected' ? 'text-green-500' : 'text-red-500'}">
      {serverStatus}
    </span>
  </div>
  <div class="status-item">
    <span class="label">Database:</span>
    <!-- <span class="indicator {dbStatus}">{dbStatus}</span> -->
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

  .indicator.connected {
    color: #4ade80;
  }

  .indicator.disconnected {
    color: #f87171;
  }
</style>
