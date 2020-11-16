<script>
  import Overlay from "./Overlay.svelte";

  import modalState from "./modalState";
  import ModalInternal from "./ModalInternal.svelte";
</script>

{#each $modalState.modals as packet}
  <Overlay onClose={packet.onClose} modalNode={packet.node}>
    <ModalInternal node={packet.node} />
  </Overlay>
{/each}
