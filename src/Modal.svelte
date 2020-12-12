<script>
  import { onMount, afterUpdate } from "svelte";
  import modalState from "./modalState";
  import "./modalInit";

  export let open = false;
  export let onClose = () => {};
  let contentNode;
  let currentlyOpen = false;

  onMount(sync);
  afterUpdate(sync);

  function sync() {
    if (!currentlyOpen && open) {
      currentlyOpen = true;
      modalState.update(state => ({ ...state, modals: [...state.modals, { node: contentNode, onClose }] }));
    } else if (currentlyOpen && !open) {
      currentlyOpen = false;
      modalState.update(state => ({ ...state, modals: state.modals.filter(d => d.node != contentNode) }));
    }
  }
</script>

<style>
  :global(.svelte-helpers-modal-content) {
    width: 50vw;
    margin: 10vh auto;
    background: white;
    padding: 2rem;
    outline: none;
    max-width: 600px;
    border-radius: 5px;
    border: 2px solid darkblue;
    overflow: hidden;
  }

  @media (max-width: 1000px) {
    :global(.svelte-helpers-modal-content) {
      width: 55vw;
    }
  }
  @media (max-width: 800px) {
    :global(.svelte-helpers-modal-content) {
      width: 60vw;
    }
  }
  @media (max-width: 650px) {
    :global(.svelte-helpers-modal-content) {
      width: 70vw;
    }
  }
  @media (max-width: 600px) {
    :global(.svelte-helpers-modal-content) {
      width: 80vw;
    }
  }
  @media (max-width: 550px) {
    :global(.svelte-helpers-modal-content) {
      width: 90vw;
    }
  }
  @media (max-width: 500px) {
    :global(.svelte-helpers-modal-content) {
      width: 95vw;
    }
  }
</style>

<div style="display: none;">
  <div bind:this={contentNode}>
    <slot />
  </div>
</div>
