<script>
  import { quadOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  export let onClose = () => {};
  export let modalNode;
  
  function overLayClicked(evt) {
    const modalRoot = modalNode.parentNode.parentNode;
    let target = evt.target;
    if (!document.body.contains(target)) {
      //clicked on something that no longer exists - assume it was something on the modal that's been removed
      return;
    }
    do {
      if (target == modalRoot) return;
    } while ((target = target.parentNode));

    onClose();
  }


</script>

<style>
  :global(.svelte-modal-overlay) {
    background: hsla(0, 0%, 0%, 0.33);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    z-index: 2;
  }
</style>

<div transition:fade={{ duration: 250, easing: quadOut }} class="svelte-modal-overlay" on:click={overLayClicked}>
  <slot />
</div>
