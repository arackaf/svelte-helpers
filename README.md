# svelte-helpers

---

## Installation 

`npm i svelte-helpers --save`

---

This library contains some helpers I've found useful for working with Svelte. Right now there's just some animation utilities, but stay tuned. I plan on adding a declarative modal component, and auto-complete, etc.

## Animation

`svelte-helpers/animation` has some functions that will help you use spring animations in an enter or exit transition. 

```js
import { springIn, springOut } from "svelte-helpers/animation";
```

Both of these functions accept from and to values, as well as spring configuration, and return a duration value, and a function to pass your "tick" value to, to get the currently animated value, for use in a svelte transition's `css` function. An example should make this much clearer.

