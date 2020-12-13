<script>
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";
  import { expoOut, quintIn } from "svelte/easing";

  import { springIn, springOut } from "./spring-transitions";

  export let node;
  export let useContentWidth;
  export let isAnimatingResizing;
  export let onHide;

  const OPEN_SPRING = { stiffness: 0.1, damping: 0.35, precision: 0.01 };
  const CLOSE_SPRING = { stiffness: 0.1, damping: 0.5, precision: 0.01 };
  // const DIMENSIONS_SPRING = { stiffness: 0.1, damping: 0.5, precision: 0.01 };
  const DIMENSIONS_SPRING = { stiffness: 0.2, damping: 0.6, precision: 0.01 };

  const { tickToValue: modalSpringIn, duration: springInDuration } = springIn(-30, 0, OPEN_SPRING);

  const { tickToValue: modalSpringOut, duration: springOutDuration } = springOut(0, 30, CLOSE_SPRING);

  let root;
  let innerContent;

  let hasInitialSize = false;
  const { sizingSpring, sync } = getDimensionsSpring();

  $: animatedHeight = hasInitialSize ? $sizingSpring.height + "px" : "";
  $: animatedWidth = hasInitialSize && useContentWidth ? $sizingSpring.width + "px" : "";
  $: dimensionStyles = [`${animatedHeight ? "height: " + animatedHeight : ""}`, `${animatedWidth ? "width: " + animatedWidth : ""}`]
    .filter(s => s)
    .join(";");

  function getDimensionsSpring() {
    const sizingSpring = spring({ height: 0, width: 0 }, { ...DIMENSIONS_SPRING, precision: 0.5 });

    const getConfig = () => {
      let immediate = !hasInitialSize || !$isAnimatingResizing;
      return immediate ? { hard: true } : {};
    };

    const sync = ({ height, width }) => {
      sizingSpring.set({ height, width }, getConfig());
    };

    return { sync, sizingSpring };
  }

  const ro = new ResizeObserver(() => {
    sync({ height: innerContent.offsetHeight, width: innerContent.offsetWidth });
    if (!hasInitialSize) {
      hasInitialSize = true;
    }
  });

  onMount(() => {
    innerContent.appendChild(node);
    ro.observe(innerContent);
    return () => {
      ro.unobserve(innerContent);
    };
  });

  function onHidden() {
    hasInitialSize = false;
    onHide && onHide();
  }

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
      }
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
      }
    };
  }
</script>

<style>
  :global(.svelte-helpers-modal-outer-container) {
    overflow: hidden;
  }
</style>

<div class="modal" in:modalIn out:modalOut on:outroend={onHidden} bind:this={root}>
  <div class="svelte-helpers-modal-content" class:content-width={useContentWidth} style={dimensionStyles}>
    <div bind:this={innerContent}>
      <slot />
    </div>
  </div>
</div>
