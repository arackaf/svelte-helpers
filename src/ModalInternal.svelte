<script>
  import { onMount } from "svelte";
  import { expoOut, quintIn } from "svelte/easing";

  import { springIn, springOut } from "svelte-helpers/spring-transitions";

  const { tickToValue: modalSpringIn, duration: springInDuration } = springIn(-30, 0, { stiffness: 0.1, damping: 0.35, precision: 0.01 });

  const outSpring = { stiffness: 0.1, damping: 0.5, precision: 0.01 };
  const { tickToValue: modalSpringOut, duration: springOutDuration } = springOut(0, 30, outSpring);

  let root;
  export let node;

  onMount(() => {
    root.appendChild(node);
  });

  function modalIn() {
    return {
      duration: springInDuration,
      css: t => {
        const transformY = modalSpringIn(t);
        const opacity = expoOut(t);

        return `
          transform: translate3d(0px, ${transformY}px, 0px);
          opacity: ${opacity};
        `;
      },
    };
  }

  function modalOut() {
    return {
      duration: springOutDuration,
      css: t => {
        const easedTransform = modalSpringOut(t);
        const easedOpacity = quintIn(t);

        return `
          transform: translate3d(0px, ${easedTransform}px, 0px);
          opacity: ${easedOpacity}
        `;
      },
    };
  }
</script>

<div class="modal" in:modalIn out:modalOut bind:this={root}>
  <slot />
</div>
