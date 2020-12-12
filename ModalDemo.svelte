<script>
  import Modal from "./src/Modal.svelte";
  import ModalDemo1 from "./ModalDemo1.svelte";
  import ModalDemo2 from "./ModalDemo2.svelte";

  let open = false;
  let open2 = false;
</script>

<button on:click={() => (open = true)}>Open</button>
<button on:click={() => (open2 = true)}>Open2</button>

<Modal {open} onClose={() => (open = false)}>
  <ModalDemo1 />
</Modal>

<Modal open={open2} onClose={() => (open2 = false)} useContentWidth={true}>
  <ModalDemo2 />
</Modal>
