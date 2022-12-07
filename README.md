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

A declarative modal component. Receives an `open` prop that, when true, renders the modal with an overlay behind it. The modal fires a `close` event when the user clicks outside the modal, or presses escape. The handler should ultimately cause your `open` prop to become false.

The modal and overlay will both animate in and out. These animations are not (yet) configurable.

```svelte
<script>
  import Modal from "svelte-helpers/Modal";

  let modalOpen = false;
  const closeModal1 = () => (modalOpen = false);
</script>

<button on:click={openModal1}>Show Modal</button>

<Modal open={modalOpen} on:close={closeModal1}>
  <h1>Hi there</h1>
  <button on:click={() => (modalOpen = false)}>Close</button>
</Modal>
```

### Live Demo

[Here](https://codesandbox.io/s/modal-vvycm?file=/App.svelte)

### Props

| Prop                 | Type | Description |
| -------------------- | ------------------------------ | ------------|
| `open`            | `bool`       | Whether the modal is open |
| `on:close`        | `function`   | Called when the user clicks outside the modal, or presses escape. This should set state so the `open` prop becomes false |
| `useContentWidth` | `bool`       | By default, the modal has a set, responsive width (that's overridable with css). Set this to true to have the modal's width size freely with your content |
| `animateResizing` | `bool` | By default changes to the modal's dimensions will animate. Pass false to turn this off. |
| `deferStateChangeOnClose` | `bool` | Used for conditionally rendering the modal itself. See below |
| `modalKey` | `string` | Used for conditionally rendering the modal itself. See below |

### Events

| Name                 | Purpose |
| -------------------- | ------------------------------ | ------------|
| `on:close`            | The modal has been closed. Use this method to set whatever state to reflect this closed state |
| `on:closing`            | The modal's closing animation has started. |
| `on:closed`            | The modal's closing animation has completed. |
| `on:mount`            | The open modal's content has been mounted in the dom. Use this event to focus an input, etc |

The Modal also has a `closeModal` method you can bind to, and call as needed.

```svelte
{#if open3a}
  <Modal modalKey="modal3a" open={true} deferStateChangeOnClose={true} bind:closeModal={closeModal3a} on:close={() => (open3a = false)}>
    <button on:click={closeModal3a}>Close</button>
  </Modal>
{/if}
```

This can be used whether conditionally rendering (explained below), or not. 

### Conditional Rendering

If you need to conditionally render the modal, ie something like this

```svelte
<script>
  import Modal from "svelte-helpers/Modal.svelte";
  let closeThisModal;
</script>

{#if open3}
  <Modal modalKey="modal3" open={true} deferStateChangeOnClose={true} on:close={() => (open3 = false)} useContentWidth={true} bind:closeModal={closeThisModal}>
    <ModalDemo2 />
  </Modal>
{/if}
```

Pass `true` to the `deferStateChangeOnClose` prop. Doing this will cause the close behavior of the modal to first run the standard exit animation, and then, once the modal is gone, fire the `close` event, to reset your state. 

If you need to imperatively close a modal that's conditionally rendered, bind to the `closeModal` method, described above, or if inside a component rendered by the Modal, just grab the `closeModal` method from context, described below. If (and only if) conditionally rendering your modal, you need to use one of these two methods to close your modal imperatively. Do *not* just reset your state, since this will immediately unmount the modal's content, without the proper unmount animations.

### Context

Within a modal there is a `svelte-helpers-modal` context value that's an object, with the following properties 

| Prop                 | Type | Description |
| -------------------- | ------------------------------ | ------------|
| `closeModal`            | `function`       | Closes the current modal. Can be used regardless of whether the modal is conditionally rendered. |
| `isAnimatingResizing` | `writable<bool>`   | Writable store of a boolean value, that controls whether changes to the modal's dimensions are animated. This defaults to true, or whatever you pass to `animateResizing`, but can be changed any time. For example, you might flip it to false while running your own animations in the modal's content, and revert it to true when finished. |

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
| `inputProps`        | `object`                       | Any props (attributes) you'd like to apply to the input |
| `currentSearch`        | `string`                       | The currently searched for text. Bind to this if you'd like to control the input's value |
| `onItemSelected`     | `(item, inputElement) => void`</span> | Optional callback to call when an item is selected. By default the input will fill its value with the selected item's `displayField` if it's an object, or the item itself if it's a string. If this callback is provided, it will be called and nothing else will happen. To cancel a selection, and prevent the options list from collapsing, return false from this call. |
| `onBlur`             | `() => void`                   | Optional callback to call when the input loses focus  |
| `filterField`        | `string`                       | If options are objects, this specifies the prop to filter by |
| `noFiltering`        | `boolean`                       | If true, no filtering will happen. Filter your options however you'd like, and pass them in |
| `keyField`        | `string`                       | If options are objects, this specifies the key prop for Svelte's #each block. Array index will be used if not provided. |
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