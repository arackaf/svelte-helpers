<script>
  import Modal, { closeModal } from "../src/modal";
  import ModalDemo1 from "./ModalDemo1.svelte";
  import ModalDemo2 from "./ModalDemo2.svelte";

  let open = false;
  let open2 = false;
  let open3 = false;
  let open4 = false;
  let open5 = false;
  let open6 = false;

  function button3() {
    open3 = true;
    setTimeout(() => {
      closeModal("modal3");
    }, 2000);
  }
</script>

<button on:click={() => (open = true)}>Open</button>
<button on:click={() => (open2 = true)}>Open2</button>
<button on:click={() => (open3 = true)}>Open3</button>
<button on:click={button3}>Open3 (auto close)</button>
<button on:click={() => (open4 = true)}>Open4 - no animate resizing</button>
<button on:click={() => (open5 = true)}>Open Nested Modal</button>

<Modal {open} on:close={() => (open = false)}>
  <ModalDemo1 />
</Modal>

<Modal modalKey="modal2" open={open2} on:close={() => (open2 = false)} useContentWidth={true}>
  <ModalDemo2 />
</Modal>

{#if open3}
  <Modal modalKey="modal3" open={true} deferStateChangeOnClose={true} on:close={() => (open3 = false)} useContentWidth={true}>
    <ModalDemo2 />
  </Modal>
{/if}

<Modal modalKey="modal4" animateResizing={false} open={open4} on:close={() => (open4 = false)} useContentWidth={true}>
  <ModalDemo2 />
</Modal>

<Modal open={open5} on:close={() => (open5 = false)}>
  <h1>Top Modal</h1>
  <div><button on:click={() => (open6 = true)}>Open Nested Modal</button></div>
</Modal>

<Modal open={open6} on:close={() => (open6 = false)}>
  <h1>Nested Modal</h1>
</Modal>
