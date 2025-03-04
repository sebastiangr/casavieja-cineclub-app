<script lang="ts">
  import { getModalStore } from '@skeletonlabs/skeleton';

  const modalStore = getModalStore();

  export let title = '';
  export let message = '';
  export let additionalField: string;
  export let onConfirm = () => {};
  export let onCancel = () => {};

  // Acceder a los datos pasados en la propiedad meta
  const meta = $modalStore[0].meta;
  title = meta.title;
  message = meta.message;
  additionalField = meta.additionalField;
  onConfirm = meta.onConfirm;
  onCancel = meta.onCancel;
</script>

<div class="bg-surface-800 border-surface-700 border-[1px] p-4 m-2 max-w-sm rounded-md shadow-md">
  <h2 class="text-lg font-bold text-center">{title}</h2>
  <p class="mt-2 text-gray-600">{message}</p>
  <p class="mt-2 text-gray-600">{additionalField}</p>

  <div class="flex justify-center gap-2 mt-4">
    <button
      class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      onclick={() => modalStore.close()}
    >
      Cancelar
    </button>
    <button
      class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      onclick={() => {
        onConfirm();
        modalStore.close();
      }}
    >
      Eliminar
    </button>
  </div>
</div>

