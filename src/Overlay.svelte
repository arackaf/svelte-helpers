<script>
  import { quadOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  export let onClose = () => {};

  let mouseDownNode;

  function overLayClicked(evt) {
    if (evt.target == mouseDownNode || mouseDownNode.parentNode === evt.target) {
      onClose();
    }
  }

  function overlayMouseDown(evt) {
    mouseDownNode = evt.target;
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
    z-index: 99;
  }
</style>

<div
  transition:fade={{ duration: 200, easing: quadOut }}
  style="will-change: opacity"
  class="svelte-modal-overlay"
  on:click={overLayClicked}
  on:mousedown={overlayMouseDown}
  on:keydown={() => {}}
>
  <slot />
</div>
