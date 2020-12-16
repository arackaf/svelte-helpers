<script>
  import { getContext } from "svelte";
  import { spring } from "svelte/motion";
  let more = false;
  let wide = false;

  let heightSpring = spring(0, { stiffness: 0.1, damping: 0.1, precision: 0.01 });
  //let heightSpring = spring(0, { stiffness: 0.9, damping: 0.9, precision: 0.01 });
  // let heightSpring = spring(0, { stiffness: 0.1, damping: 0.5, precision: 0.01 });
  let { isAnimatingResizing, closeModal } = getContext("svelte-helpers-modal");

  $: {
    let open = more;
    $isAnimatingResizing = false;
    heightSpring.set(open ? 170 : 0).then(() => {
      $isAnimatingResizing = true;
    });
  }
</script>

<div>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam erat nunc, sagittis id nibh non, eleifend malesuada libero. Morbi ex lorem, tempor
    quis dapibus vel, faucibus a eros. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris varius
    rhoncus turpis, sed semper erat vestibulum vel. Nulla in mauris lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tortor
    lectus, dapibus vitae purus vel, dapibus semper ligula. Sed a tellus scelerisque, porttitor massa maximus, convallis metus. Ut finibus ultrices
    risus, ut placerat ante venenatis at. Vivamus sed dui vitae eros hendrerit viverra sed at ex.
  </p>
  <button on:click={() => (more = !more)}>Toggle More</button>
  <button on:click={() => (wide = !wide)}>Toggle Wide</button>

  <br />

  <input />

  <button on:click={closeModal}>Close</button>

  <div style="height: {$heightSpring}px; overflow: hidden">
    <p style="margin: 0">
      Aliquam auctor nisl velit, sit amet tincidunt diam blandit vel. Proin bibendum quam nec metus posuere euismod. Morbi cursus imperdiet hendrerit.
      Aliquam pharetra id lectus a elementum. Suspendisse velit velit, molestie et ante vel, bibendum vehicula elit. Pellentesque condimentum tortor
      nisi, vel convallis ligula ultrices vel. Etiam odio velit, fringilla id lorem vitae, hendrerit iaculis tortor. Praesent suscipit volutpat
      sollicitudin. Aenean varius velit sed lorem ullamcorper efficitur. Quisque sit amet consequat ligula, quis dapibus lectus. Vivamus vitae risus
      sit amet neque laoreet ornare. Phasellus vulputate scelerisque libero pulvinar condimentum.
    </p>
  </div>
</div>

{#if wide}
  <div style="width: 70vw; height: 300px; background-color: blue" />
{/if}
