<script lang="ts">
	import { Home, Clapperboard, MessageSquare, UserRound, Star, History } from "lucide-svelte";

  

</script>

<!-- bg-primary-500 fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-7xl h-20 pl-8 pr-8 z-0 -->
<div class="bg-primary-500 fixed flex flex-col justify-center left-1/2 transform -translate-x-1/2 w-auto align-bottom h-20 pl-8 pr-8 -mt-24 z-0 rounded-md">

  <div class="flex">
    <ul class="flex gap-8">
      <!-- TODO: Es necesario un inicio? -->
      <!-- <li>
        <button class="group flex flex-col items-center justify-center">
          <Home class="group-hover:scale-105 transition duration-200" strokeWidth={1.5} size={30} />
          <span>Inicio</span>
        </button>
      </li> -->
      <li>
        <button class="group flex flex-col items-center justify-center">
          <Clapperboard class="group-hover:scale-105 transition duration-200" strokeWidth={1.75} size={30} />
          <span class="text-center font-bold hidden md:block">Películas</span>
        </button>
      </li>
      <li>
        <button class="group flex flex-col items-center justify-center">
          <Star class="group-hover:scale-105 transition duration-200" strokeWidth={1.75} size={30} />
          <span class="text-center font-bold hidden md:block">Selección</span>
        </button>
      </li>      
      <li>
        <button class="group flex flex-col items-center justify-center">
          <History class="group-hover:scale-105 transition duration-200" strokeWidth={1.75} size={30} />
          <span class="text-center font-bold hidden md:block">Historial</span>
        </button>
      </li>
      <!-- TODO: Mensajes eventualmente se quitará -->
      <li>
        <button class="group flex flex-col items-center justify-center">
          <MessageSquare class="group-hover:scale-105 transition duration-200" strokeWidth={1.75} size={30} />
          <span class="text-center font-bold hidden md:block">Mensajes</span>
        </button>
      </li>
      <li>
        <button class="group flex flex-col items-center justify-center">
          <UserRound class="group-hover:scale-105 transition duration-200" strokeWidth={1.75} size={30} />
          <span class="text-center font-bold hidden md:block">Perfil</span>
        </button>
      </li>
      
    </ul>
    <!-- <h1>MENÚ INFERIOR</h1> -->
  </div>
  
</div>


<style>

</style>
