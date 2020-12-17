<script>
  import { tick, onMount, afterUpdate, setContext, createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import modalState from "./modalState";
  import "./modalInit";

  export let open = false;
  export let useContentWidth = false;
  export let deferStateChangeOnClose = false;
  export let modalKey = "";
  export let animateResizing = true;

  const dispatch = createEventDispatcher();
  let onClose = () => {
    dispatch("close");
  };

  let contentNode;
  let currentlyOpen = false;

  const isAnimatingResizing = writable(animateResizing);

  let closeIt = () => {
    currentlyOpen = false;
    modalState.update(state => ({ ...state, modals: state.modals.filter(d => d.node != contentNode) }));
  };
  export let closeModal;
  closeModal = () => {
    if (deferStateChangeOnClose) {
      tick().then(closeIt);
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
      let props = { onClose, modalKey, node: contentNode, isAnimatingResizing, useContentWidth };
      if (deferStateChangeOnClose) {
        props.onClose = closeIt;
        props.onHide = onClose;
      }
      modalState.update(state => ({ ...state, modals: [...state.modals, props] }));
    } else if (currentlyOpen && !open) {
      closeIt();
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
      --modal-content-padding: 1rem;
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
