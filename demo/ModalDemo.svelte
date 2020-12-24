<script>
  import Modal from "../Modal.svelte";
  import ModalDemo1 from "./ModalDemo1.svelte";
  import ModalDemo2 from "./ModalDemo2.svelte";

  let open = false;
  let openSecond = false;
  let open2 = false;
  let open3 = false;
  let open3a = false;
  let open4 = false;
  let open5 = false;
  let open6 = false;

  function button3() {
    open3 = true;
  }

  let closeModal3a;
  let closeModal1a;
  let counter = 0;

  let closeSecond;
  let el;
</script>

<button on:click={() => (open = true)}>Open</button>
<button on:click={() => (open2 = true)}>Open2</button>
<button on:click={() => (open3 = true)}>Open3</button>
<button on:click={() => (open3a = true)}>Open3a</button>
<button on:click={button3}>Open3 (auto close)</button>
<button on:click={() => (open4 = true)}>Open4 - no animate resizing</button>
<button on:click={() => (open5 = true)}>Open Nested Modal</button>

{counter}

{#if openSecond}
  <Modal open={openSecond} deferStateChangeOnClose={true} bind:closeModal={closeSecond} on:close={() => (openSecond = false)}>
    AYYYYYYYYYYYYYYYY
  </Modal>
{/if}

<Modal {open} bind:closeModal={closeModal1a} on:mount={() => el.focus()} on:close={() => (open = false)} on:closing={() => console.log('closing')}>
  <input bind:this={el} />
  <ModalDemo1 />
  <hr />
  <button on:click={closeModal1a}>Close</button>
</Modal>

<Modal modalKey="modal2" open={open2} on:close={() => (open2 = false)} useContentWidth={true}>
  <ModalDemo2 />
</Modal>

{#if open3}
  <Modal
    modalKey="modal3"
    open={true}
    deferStateChangeOnClose={true}
    on:close={() => (open3 = false)}
    on:closing={() => console.log('closing')}
    useContentWidth={true}>
    <ModalDemo2 />
  </Modal>
{/if}

{#if open3a}
  <Modal
    modalKey="modal3a"
    open={true}
    deferStateChangeOnClose={true}
    bind:closeModal={closeModal3a}
    on:close={() => (open3a = false)}
    useContentWidth={true}>
    <ModalDemo2 />
    <hr />
    <button
      on:click={() => {
        counter++;
        closeModal3a();
      }}>Close 2</button>
    <button
      on:click={() => {
        closeModal3a();
        counter++;
      }}>Close 2a</button>
    <button on:click={() => (open3a = false)}>Nuke</button>
    <button
      on:click={() => {
        closeModal3a();
        openSecond = true;
      }}>Close then open</button>
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
