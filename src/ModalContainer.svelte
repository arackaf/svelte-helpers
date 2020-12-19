<script>
  import { get } from "svelte/store";
  import Overlay from "./Overlay.svelte";

  import modalState from "./modalState";
  import ModalInternal from "./ModalInternal.svelte";

  const keyDown = evt => {
    if (evt.keyCode == 27) {
      const currentModals = get(modalState).modals;
      const currentModal = currentModals[currentModals.length - 1];

      if (currentModal && currentModal.onClose) {
        currentModal.onClose();
      }
    }
  };
</script>

<svelte:window on:keydown={keyDown} />

{#each $modalState.modals as { modalKey, ...packet } (packet.node)}
  <Overlay onClose={packet.onClose} modalNode={packet.node}>
    <ModalInternal {...packet} />
  </Overlay>
{/each}
