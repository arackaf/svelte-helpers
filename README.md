# svelte-helpers

---

## Installation 

`npm i svelte-helpers --save`

---

This library contains some helpers I've found useful for working with Svelte. 

## Spring helpers

`svelte-helpers/spring-transitions` has some functions that will help you use spring animations in an enter or exit transition. 

```js
springIn(from: number, to: number, springConfig: object)
springOut(from: number, to: number, springConfig: object)
```

Both of these functions return an object with a duration, and tickToValue property, for use in a Svelte transition. Duration is the duration of the given spring, while `tickToValue` is a lookup function that will return the springs actual value for a given value of `t` in the transition's `css` function. For example:

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
