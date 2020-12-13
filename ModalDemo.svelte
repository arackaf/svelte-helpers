<script>
  import Modal, { closeModal } from "./src/modal";
  import ModalDemo1 from "./ModalDemo1.svelte";
  import ModalDemo2 from "./ModalDemo2.svelte";

  let open = false;
  let open2 = false;
  let open3 = false;
  let open4 = false;

  function button3() {
    open3 = true;
    setTimeout(() => {
      closeModal("modal3");
    }, 2000);
  }

  function button4() {
    open4 = true;
    setTimeout(() => {
      closeModal("modal4");
    }, 2000);
  }
</script>

<button on:click={() => (open = true)}>Open</button>
<button on:click={() => (open2 = true)}>Open2</button>
<button on:click={() => (open3 = true)}>Open3</button>
<button on:click={button3}>Open3 (auto close)</button>
<button on:click={button4}>Open4 (auto close)</button>

<Modal {open} onClose={() => (open = false)}>
  <ModalDemo1 />
</Modal>

<Modal modalKey="modal2" open={open2} onClose={() => (open2 = false)} useContentWidth={true}>
  <ModalDemo2 />
</Modal>

{#if open3}
  <Modal modalKey="modal3" open={open3} deferStateChangeOnClose={true} onClose={() => (open3 = false)} useContentWidth={true}>
    <ModalDemo2 />
  </Modal>
{/if}

<Modal modalKey="modal4" open={open4} onClose={() => (open4 = false)} useContentWidth={true}>
  <ModalDemo2 />
</Modal>
