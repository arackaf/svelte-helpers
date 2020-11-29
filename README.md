# svelte-helpers

---

## Installation

`npm i svelte-helpers --save`

---

This library contains some helpers I've found useful for working with Svelte.

## Spring helpers

`svelte-helpers/spring-transitions` has functions to help you use spring animations in an enter or exit transition.

```js
springIn((from: number), (to: number), (springConfig: object));
springOut((from: number), (to: number), (springConfig: object));
```

Both of these functions return an object with a `duration`, and `tickToValue` property, for use in a Svelte transition. Duration is the `duration` of the given spring, while `tickToValue` is a lookup function that will return the spring's actual value for a given value of `t` in the transition's `css` function. For example:

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

The modal and overlay will both animate in and out, although these animations are not (yet) configurable.

```svelte
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
```

### Live Demo

[Here](https://codesandbox.io/s/modal-vvycm?file=/App.svelte)

### Style Overrides

The modal has a global css class of `svelte-helpers-modal-content` applied. Add your own overrides as needed.


## AutoSuggest

```svelte
<script>
  import AutoSuggest from "svelte-helpers/AutoSuggest";
</script>

<AutoSuggest filterField={'name'} displayField="name" placeholder="Search" {options}>
  <div slot="result" let:option>{option.name}</div>
  <span slot="no-results" style="color: blue">No Results, yo</span>
</AutoSuggest>
```

### Live Demo

[Here](https://codesandbox.io/s/auto-suggest-4puis?file=/App.svelte)

### Props

| Prop                 | Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
| -------------------- | ------------------------------ | ------------|
| `options`            | `[object]` or `[string]`       | The options to show |
| `placeholder`        | `string`                       | The input's placeholder |
| `inputStyles`        | `string`                       | The input's styles, if any |
| `onItemSelected`     | `(item, inputElement) => void`</span> | Optional callback to call when an item is selected. By default the input will fill its value with the selected item's `displayField` if it's an object, or the item itself if it's a string. If this callback is provided, it will be called and nothing else will happen. |
| `onBlur`             | `() => void`                   | Optional callback to call when the input loses focus.  |
| `filterField`        | `string`                       | If options are objects, this specifies the prop to filter by |
| `displayField`       | `string`                       | If options are objects, this specifies the prop to display when selected |
| `filterByStartsWith` | `boolean = false`              | If true the options will filter based on a match from the start of the option. Otherwise options will filter based on a match anywhere in the option's text |

### Slots

`result` - the slot for each option the user is viewing
<br />
`no-results` - the slot to show when there are no results to display

### CSS Overrides

The following CSS variables can be overridden to customize this component's appearance 

| Var | Purpose |
| ---- | ----- |
|`--svelte-helpers-auto-complete-border-color` | Border color for the input and options container |
|`--svelte-helpers-auto-complete-border-width` | Border width for the input and options container | 
|`--svelte-helpers-auto-complete-border-radius` | Border radius for the input and options container |
|`--svelte-helpers-auto-complete-option-padding` | Padding of each result option |
|`--svelte-helpers-auto-complete-results-max-height` | Options container max height |
|`--svelte-helpers-auto-complete-option-hover-background` | Option background color when hovered |
|`--svelte-helpers-auto-complete-option-cursor` | Cursor for options |
|`--svelte-helpers-auto-complete-options-background-color` | Options container background color |