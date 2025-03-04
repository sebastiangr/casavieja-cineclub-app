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

<!-- TODO: Dar estilos al modal de confirmación de eliminación. -->
<div class="bg-surface-800 border-surface-700 border-[1px] p-4 m-2 max-w-sm rounded-md shadow-md">
  <h2 class="text-lg font-bold text-center text-primary-500">{title}</h2>
  <p class="mt-2 text-center text-surface-200">¿{message} {additionalField}?</p>
  <!-- <p class="mt-2 text-gray-600"></p> -->

  <div class="flex justify-center gap-2 mt-4">
    <button
      class="btn variant-filled px-4 py-2"
      onclick={() => modalStore.close()}
    >
      Cancelar
    </button>
    <button
      class="btn variant-filled-primary px-4 py-2 outline-primary-600"
      onclick={() => {
        onConfirm();
        modalStore.close();
      }}
    >
      Eliminar
    </button>
  </div>
</div>

<style>
  /* .modal *:focus:not([tabindex='-1']):not(.input):not(.textarea):not(.select):not(.input-group):not(.input-group input) {
    outline-style: solid !important;
    outline-width: 1px !important;
    outline-color: var(--color-primary-500) !important;
  } */
  :focus {
    outline-style: solid !important;
    outline-width: 1px !important;
    /* outline-color: var(--color-primary-500) !important; */
  }
</style>