# svelte-helpers

---

## Installation 

`npm i svelte-helpers --save`

---

This library contains some helpers I've found useful for working with Svelte. 

## Spring helpers

`svelte-helpers/spring-transitions` has functions to help you use spring animations in an enter or exit transition. 

```js
springIn(from: number, to: number, springConfig: object)
springOut(from: number, to: number, springConfig: object)
```

Both of these functions return an object with a `duration`, and `tickToValue` property, for use in a Svelte transition. Duration is the duration of the given spring, while `tickToValue` is a lookup function that will return the spring's actual value for a given value of `t` in the transition's `css` function. For example:

```js
import { springIn, springOut } from "svelte-helpers/spring-transitions";

const SPRING_IN = { stiffness: 0.1, damping: 0.1 };
const animateIn = node => {
  const { duration, tickToValue } = springIn(-80, 0, SPRING_IN);
  return {
    duration: duration,
    css: t => `transform: translateY(${tickToValue(t)}px)`
  };
};

const SPRING_OUT = { stiffness: 0.1, damping: 0.5, precision: 3 };
const animateOut = node => {
  const current = currentYTranslation(node);
  const { duration, tickToValue } = springOut(
    current ? current : 0,
    80,
    SPRING_OUT
  );

  return {
    duration: duration,
    css: t => `transform: translateY(${tickToValue(t)}px)`
  };
};

{#if open}
  <div in:animateIn out:animateOut class="box">
    Hello World!
  </div>
{/if}
```

## Modal

A declarative modal component. Receives an `open` prop that, when true, renders the modal with an overlay behind it. The modal also takes an `onClose` function that's called when the user clicks outside the modal, or presses escape. This function should ultimately cause your `open` prop to become false.

The modal and overlay will both animate in and out nicely, although these animations are not (yet) configurable. 

<script>
  import Modal from "svelte-helpers/Modal";

  let modalOpen = false;
  const closeModal1 = () => (modalOpen = false);
</script>

<button on:click={openModal1}>Show Modal</button>

<Modal open={modalOpen} onClose={closeModal1}>
  <h1>Hi there</h1>
  <button on:click={() => (modalOpen = false)}>Close</button>
</Modal>

Live demo coming soon - this project is incredibly new still... 