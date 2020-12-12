<script>
  import Modal from "./src/Modal.svelte";
  let open = false;
  let more = false;
</script>

{open} - {more}
<button on:click={() => (open = true)}>Open</button>

<Modal {open} onClose={() => (open = false)}>
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam erat nunc, sagittis id nibh non, eleifend malesuada libero. Morbi ex lorem,
      tempor quis dapibus vel, faucibus a eros. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris
      varius rhoncus turpis, sed semper erat vestibulum vel. Nulla in mauris lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
      tortor lectus, dapibus vitae purus vel, dapibus semper ligula. Sed a tellus scelerisque, porttitor massa maximus, convallis metus. Ut finibus
      ultrices risus, ut placerat ante venenatis at. Vivamus sed dui vitae eros hendrerit viverra sed at ex.
    </p>
    <button on:click={() => (more = !more)}>Toggle More</button>

    {#if more}
      <p>
        Aliquam auctor nisl velit, sit amet tincidunt diam blandit vel. Proin bibendum quam nec metus posuere euismod. Morbi cursus imperdiet
        hendrerit. Aliquam pharetra id lectus a elementum. Suspendisse velit velit, molestie et ante vel, bibendum vehicula elit. Pellentesque
        condimentum tortor nisi, vel convallis ligula ultrices vel. Etiam odio velit, fringilla id lorem vitae, hendrerit iaculis tortor. Praesent
        suscipit volutpat sollicitudin. Aenean varius velit sed lorem ullamcorper efficitur. Quisque sit amet consequat ligula, quis dapibus lectus.
        Vivamus vitae risus sit amet neque laoreet ornare. Phasellus vulputate scelerisque libero pulvinar condimentum.
      </p>
    {/if}
  </div>
</Modal>
