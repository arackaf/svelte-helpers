<script>
  import { onMount, afterUpdate, setContext, createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import { renderModal, unRenderModal, blockModal, releaseModal } from "./src/modalState";
  import "./src/modalInit";

  export let open = false;
  export let useContentWidth = false;
  export let deferStateChangeOnClose = false;
  export let modalKey = "";
  export let animateResizing = true;

  const dispatch = createEventDispatcher();
  let onClose = () => {
    releaseModal(contentNode);
    dispatch("close");
  };

  const onModalMount = () => {
    dispatch("mount");
  };

  let contentNode;
  let currentlyOpen = false;

  const isAnimatingResizing = writable(animateResizing);

  let closeIt = () => {
    currentlyOpen = false;
    dispatch("closing");
    unRenderModal(contentNode);
  };
  
  let onClosed = () => {
    dispatch("closed");
  }
  export const closeModal = () => {
    if (deferStateChangeOnClose) {
      blockModal(contentNode);
      closeIt();
    } else {
      onClose();
    }
  };

  setContext("svelte-helpers-modal", { isAnimatingResizing, closeModal });

  onMount(() => {
    sync();
    return () => {
      if (currentlyOpen) {
        closeIt();
      }
    };
  });
  afterUpdate(sync);

  function sync() {
    if (!currentlyOpen && open) {
      currentlyOpen = true;
      let props = { onClose, onClosed, modalKey, node: contentNode, isAnimatingResizing, useContentWidth, onModalMount };
      if (deferStateChangeOnClose) {
        props.onClose = closeIt;
        props.onHide = onClose;
      }
      renderModal(props);
    } else if (currentlyOpen && !open) {
      closeIt();
    }
  }
</script>

<style>
  :global(.svelte-helpers-modal-content) {
    --modal-width: 600px;
    --modal-content-padding: 2rem;
    max-width: var(--modal-width);
    width: auto;
    margin: 10vh auto;
    background: white;
    outline: none;
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

  @media (max-width: 800px) {
    :global(.svelte-helpers-modal-content) {
      --modal-width: 75vw;
    }
  }

  @media (max-width: 600px) {
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
