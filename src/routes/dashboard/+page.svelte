<script lang="ts">
	import { page } from '$app/state';
  import type { Message } from '$lib/types';
	import { userStore } from '$lib/stores/userStore';

  let messages = $state<Message[]>([]);
  let newMessage = $state('');
  // let user = userStore; // ✅ Obtener usuario autenticado
  let user = page.data.user;

  async function fetchMessages() {
    const res = await fetch('/messages');
    messages = await res.json();
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;

    const res = await fetch('/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newMessage })
    });

    if (res.ok) {
      newMessage = '';
      fetchMessages(); // 🔥 Recargar mensajes
    }
  }

  async function deleteMessage(id: any) {
    const res = await fetch('/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    if (res.ok) {
      fetchMessages(); // 🔥 Recargar mensajes
    }
  }

  $effect(() => {
    fetchMessages();
  })

</script>

<div class="flex flex-col items-center justify-center min-h-screen">

  <h1>DASHBOARD VIEW</h1>

	{#if user}
		<h1 class="text-2xl font-bold">¡Bienvenido, {user.fullName}!</h1>
		<p class="text-gray-600">@{user.username}</p>
	{:else}
		<p>Cargando...</p>
	{/if}

  <div class="items-center w-5/6 mt-5">

    <h1 class="text-2xl font-bold text-center">Mensajes Públicos</h1>

    <ul class="flex flex-col mb-5">
      {#each messages as message}
        <li class="card mb-4">
          <header class="card-header"><strong>{message.user.username}</strong></header>
          <section class="p-4">{message.content}</section>
          <footer class="card-footer">
            {message.createdAt}
            {#if user?.userId === message.user.id}
              <button onclick={() => deleteMessage(message.id)}>🗑 Eliminar</button>
            {/if}
          </footer>
        </li>
      {/each}
    </ul>
    <!-- <ul class="flex flex-col mb-5">
      {#each messages as message}
        <li class="border brorder-gray-300 rounded-lg p-2 my-2">
          <p><strong>{message.user.fullName || message.user.username}:</strong> {message.content}</p>
          <span>{new Intl.DateTimeFormat('es-AR', { year: '2-digit', month: '2-digit', day: '2-digit' }).format(new Date(message.createdAt))}</span>
          {#if user?.userId === message.user.id}
            <button onclick={() => deleteMessage(message.id)}>🗑 Eliminar</button>
          {/if}
        </li>
      {/each}
    </ul> -->
  
    <textarea bind:value={newMessage} rows="4" class="textarea p-4" placeholder="Escribe un mensaje..."></textarea>
    <button onclick={sendMessage} type="button" class="btn variant-filled-primary w-full mt-4">Enviar</button>
  
  </div>

</div>


