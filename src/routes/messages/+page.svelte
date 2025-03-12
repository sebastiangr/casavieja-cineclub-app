<script lang="ts">
	import { page } from '$app/state';
  import type { Message } from '$lib/types';	
	import { CircleX } from 'lucide-svelte';

  let user = page.data.user;
  let loading = $state(true);
  let loadingSend = $state(false);
  let messages = $state<Message[]>([]);
  let newMessage = $state('');


  // FUNCIONES MENSAJES / TODO: MOVER A +server.ts
  async function fetchMessages() {
    loading = true; // Establecer carga en verdadero antes de fetch
    const res = await fetch('/messages');
    messages = await res.json();
    loading = false; // Establecer carga en falso después de fetch
  }

  async function sendMessage() {
    loadingSend = true;
    if (!newMessage.trim()) return;

    const res = await fetch('/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newMessage })
    });

    if (res.ok) {
      newMessage = '';
      fetchMessages(); // 🔥 Recargar mensajes
      loadingSend = false;
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

<!-- TODO: Al hacer logout salir al login, proteger ruta. -->
<!-- TODO: Añadir loading y deshabilitar formulario al enviar un nuevo mensaje. -->

<div class="flex flex-col items-center justify-center align-center pb-28 md:w-5/6 w-full">

  <!-- LISTA MENSAJES -->
  <div class=" items-center mt-5">
    <h1 class="text-2xl font-bold text-center mb-5">Mensajes Públicos</h1>
    <span class="flex text-md text-surface-400 items-center justify-center text-center p-5 mb-5  mr-10 ml-10">Deja aquí un comentario acerca de qué funcionalidad quieres ver, alguna mejora, error, bug, o simplemente deja un saludo.</span>

    {#if loading}
      <!-- Mostrar preloader mientras se carga el listado -->
      <div class="flex flex-col items-center justify-center mb-5">
        <!-- <span class="mb-2">Cargando listado...</span> -->
        <div class="loader big"></div>
      </div>
    {:else}
      <!-- Mostrar listado de mensajes -->
      <ul class="flex flex-col items-center mb-5">
        {#each messages as message}
          <li class="card !bg-surface-700 w-5/6 md:min-w-[460px] md:w-5/6 mb-4">
            <header class="card-header text-primary-500"><strong>Por: {message.user.username}</strong></header>
            <section class="p-4">{message.content}</section>
            <footer class="card-footer flex justify-between items-center">
              
              <span class="text-surface-400">
                Publicado el: {new Date(message.createdAt).toLocaleDateString()}
              </span>
              <!-- TODO: Repensar este botón -->
              {#if user?.userId === message.user.id}
                  <button class="flex items-center px-1 group hover:text-red-500" onclick={() => deleteMessage(message.id)}>
                    <span class="pr-2 opacity-0 group-hover:opacity-100 transition-opacity">Borrar</span>
                    <CircleX strokeWidth={1.25} />
                  </button>
              {/if}
            </footer>
          </li>
        {/each}
      </ul>      
    {/if}

  </div>

  <!-- MENSAJE TEXTAREA -->
  <div class="items-center mt-5 w-5/6 md:w-[460px]">
    <textarea bind:value={newMessage} rows="4" class="textarea p-4" placeholder="Escribe un mensaje..."></textarea>
    <button 
      onclick={sendMessage} 
      class="btn variant-filled-primary w-full mt-4"
      type="button"
      style="pointer-events: {loading ? 'none' : 'auto'}" 
      disabled={loading}>
      {#if loading}
        <span class="loader"></span>Enviando mensaje...
      {:else}
        Enviar
      {/if}
      
    </button>
  </div>

</div>