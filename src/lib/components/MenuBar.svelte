<script lang="ts">
	import { userStore } from "$lib/stores/userStore";
	import type { User } from "$lib/types";
	import { Clapperboard, MessageSquare, UserRound, Star, History } from "lucide-svelte";

  // let user: User | null;
  // userStore.subscribe((value) => user = value);
  // let { user } = $props();
  
</script>

<!-- bg-primary-500 fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-7xl h-20 pl-8 pr-8 z-0 -->
<!-- {#if user} -->
  <!-- <div class="bg-primary-500 fixed flex flex-col justify-center left-1/2 transform -translate-x-1/2 w-auto align-bottom h-20 pl-4 pr-4 -mt-24 z-50 rounded-md"> -->
  <div class="fixed left-1/2 transform -translate-x-1/2 bottom-0 flex justify-center items-center w-full z-50">

    <div class="bg-primary-500 flex items-center h-20 pl-0 pr-0 mb-0 rounded-none md:pl-4 md:pr-4 md:mb-4 md:rounded-md w-full md:w-auto">
      <ul class="flex justify-around items-center w-full gap-4">
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
        <!-- <li>
          <a href="/peliculas" class="group flex flex-col items-center justify-center p-2">
            <Star class="group-hover:scale-105 transition duration-200" strokeWidth={1.75} size={30} />
            <span class="text-center font-bold hidden md:block">Selección</span>
          </a>
        </li>       -->
        <!-- <li>
          <a href="/"  class="group flex flex-col items-center justify-center p-2">
            <History class="group-hover:scale-110 transition duration-200" strokeWidth={1.75} size={30} />
            <span class="text-center font-bold hidden md:block">Historial</span>
          </a>
        </li> -->
        <!-- TODO: Mensajes eventualmente se quitará -->
        <li>
          <a href="/messages" class="group flex flex-col items-center justify-center p-2">
            <MessageSquare class="group-hover:scale-105 transition duration-200" strokeWidth={1.75} size={30} />
            <span class="text-center font-bold hidden md:block">Mensajes</span>
          </a>
        </li>
        <li>
          <a href="/usuario" class="group flex flex-col items-center justify-center p-2">
            <UserRound class="group-hover:scale-105 transition duration-200" strokeWidth={1.75} size={30} />
            <span class="text-center font-bold hidden md:block">Usuario</span>
          </a>
        </li>
      </ul>
    </div>
    
  </div>
<!-- {/if} -->
