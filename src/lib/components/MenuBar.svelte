<script lang="ts">
	import { Clapperboard, MessageSquare, UserRound, Star, History } from "lucide-svelte";

  let { user } = $props();
  
</script>

<!-- bg-primary-500 fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-7xl h-20 pl-8 pr-8 z-0 -->
{#if user}
  <!-- <div class="bg-primary-500 fixed flex flex-col justify-center left-1/2 transform -translate-x-1/2 w-auto align-bottom h-20 pl-4 pr-4 -mt-24 z-50 rounded-md"> -->
  <div class="fixed bottom-0 flex justify-center items-center w-full z-50">

    <div class="flex bg-primary-500 items-center h-20 pl-4 pr-4 rounded-md mb-4">
      <ul class="flex gap-4">
        <!-- TODO: Es necesario un inicio? -->
        <!-- <li>
          <button class="group flex flex-col items-center justify-center">
            <Home class="group-hover:scale-105 transition duration-200" strokeWidth={1.5} size={30} />
            <span>Inicio</span>
          </button>
        </li> -->
        <li>
          <a href="/peliculas" class="group flex flex-col items-center justify-center p-2">
            <Clapperboard class="group-hover:scale-105 transition duration-200" strokeWidth={1.75} size={30} />
            <span class="text-center font-bold hidden md:block">Películas</span>
          </a>
        </li>
        <li>
          <a href="/peliculas" class="group flex flex-col items-center justify-center p-2">
            <Star class="group-hover:scale-105 transition duration-200" strokeWidth={1.75} size={30} />
            <span class="text-center font-bold hidden md:block">Selección</span>
          </a>
        </li>      
        <li>
          <a href="/"  class="group flex flex-col items-center justify-center p-2">
            <History class="group-hover:scale-110 transition duration-200" strokeWidth={1.75} size={30} />
            <span class="text-center font-bold hidden md:block">Historial</span>
          </a>
        </li>
        <!-- TODO: Mensajes eventualmente se quitará -->
        <li>
          <a href="/messages" class="group flex flex-col items-center justify-center p-2">
            <MessageSquare class="group-hover:scale-105 transition duration-200" strokeWidth={1.75} size={30} />
            <span class="text-center font-bold hidden md:block">Mensajes</span>
          </a>
        </li>
        <li>
          <a href="/dashboard" class="group flex flex-col items-center justify-center p-2">
            <UserRound class="group-hover:scale-105 transition duration-200" strokeWidth={1.75} size={30} />
            <span class="text-center font-bold hidden md:block">Perfil</span>
          </a>
        </li>
      </ul>
    </div>
    
  </div>
{/if}

<style>
  .menu-bar {
    position: fixed;
    width: 100%;
    max-width: 700px;
  }
</style>