<script>
  import { onMount, afterUpdate, setContext } from "svelte";
  import { writable } from "svelte/store";
  import modalState from "./modalState";
  import "./modalInit";

  export let open = false;
  export let onClose = () => {};
  export let useContentWidth = false;
  let contentNode;
  let currentlyOpen = false;

  export let animateDimensions = true;
  const animatingDimensions = writable(animateDimensions);
  setContext("svelte-helpers-modal-animation-settings", animatingDimensions);

  onMount(sync);
  afterUpdate(sync);

  function sync() {
    if (!currentlyOpen && open) {
      currentlyOpen = true;
      modalState.update(state => ({ ...state, modals: [...state.modals, { node: contentNode, onClose, useContentWidth, animatingDimensions }] }));
    } else if (currentlyOpen && !open) {
      currentlyOpen = false;
      modalState.update(state => ({ ...state, modals: state.modals.filter(d => d.node != contentNode) }));
    }
  }
</script>

<style>
  :global(.svelte-helpers-modal-content) {
    --modal-width: 50vw;
    --modal-content-padding: 2rem;
    width: var(--modal-width);
    margin: 10vh auto;
    background: white;
    outline: none;
    max-width: 600px;
    border-radius: 5px;
    border: 2px solid darkblue;
    overflow: hidden;
  }
  :global(.svelte-helpers-modal-content > *) {
    padding: var(--modal-content-padding);
  }
  :global(.svelte-helpers-modal-content.content-width) {
    display: flex;
    width: unset;
    max-width: unset;
  }
  :global(.svelte-helpers-modal-content.content-width > *) {
    align-self: baseline;
  }

  @media (max-width: 1000px) {
    :global(.svelte-helpers-modal-content) {
      --modal-width: 55vw;
    }
  }
  @media (max-width: 800px) {
    :global(.svelte-helpers-modal-content) {
      --modal-width: 60vw;
    }
  }
  @media (max-width: 650px) {
    :global(.svelte-helpers-modal-content) {
      --modal-width: 70vw;
    }
  }
  @media (max-width: 600px) {
    :global(.svelte-helpers-modal-content) {
      --modal-width: 80vw;
      --modal-content-padding: 1rem
    }
  }
  @media (max-width: 550px) {
    :global(.svelte-helpers-modal-content) {
      --modal-width: 90vw;
    }
  }
  @media (max-width: 500px) {
    :global(.svelte-helpers-modal-content) {
      --modal-width: 95vw;
    }
  }
</style>

<div style="display: none;">
  <div bind:this={contentNode}>
    <slot />
  </div>
</div>
