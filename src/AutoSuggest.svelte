<script>
  import { fade, slide } from "svelte/transition";
  let open = false;

  let currentSearch = "";
  export let options = [];
  export let placeholder = "";
  export let filterField = "";
  let filteredOptions = options;

  function onBlur() {
    open = false;
  }

  function filterOptions() {
    return options.filter(item => new RegExp(currentSearch, "i").test(item[filterField]));
  }
  $: {
    filteredOptions = currentSearch ? filterOptions() : options;
  }

  const test = () => void 0;
</script>

<style>
  :root {
    --svelte-helpers-auto-complete-border-color: lightgray;
    --svelte-helpers-auto-complete-border-width: 1px;
    --svelte-helpers-auto-complete-border-radius: 4px;
    --svelte-helpers-auto-complete-item-padding: 5px;
    --svelte-helpers-auto-complete-item-hover-background: lightgray;
    --svelte-helpers-auto-complete-item-hover-cursor: pointer;
  }

  .root {
    display: inline-flex;
    flex-direction: column;
  }

  input {
    border: var(--svelte-helpers-auto-complete-border-width) solid var(--svelte-helpers-auto-complete-border-color);
    border-radius: 5px;
    padding: 5px;
    outline: none;
  }

  :global(input.open) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .items-root {
    position: relative;
  }

  .items-container {
    min-width: calc(100% - 2 * var(--svelte-helpers-auto-complete-border-width));
    border: var(--svelte-helpers-auto-complete-border-width) solid var(--svelte-helpers-auto-complete-border-color);
    border-radius: var(--svelte-helpers-auto-complete-border-radius);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    position: absolute;
    left: 0;
    top: calc(-1 * var(--svelte-helpers-auto-complete-border-width));
    max-height: 200px;
    overflow: hidden;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style-type: none;
    white-space: nowrap;
    padding: var(--svelte-helpers-auto-complete-item-padding);
    margin: 0;
  }

  li.result:hover {
    background-color: var(--svelte-helpers-auto-complete-item-hover-background);
    cursor: var(--svelte-helpers-auto-complete-item-hover-cursor);
  }
</style>

<div class="root" class:open>
  <input {placeholder} bind:value={currentSearch} on:focus={() => (open = true)} on:blur={onBlur} class:open />
  {#if open}
    <div transition:fade={{ duration: 150 }} class="items-root">
      <div class="items-container">
        <ul>
          {#each filteredOptions as option (option.name)}
            <li class="result">
              <slot name="result" {option}>Hello World FOO Hello World Hello World Hello World Hello World</slot>
            </li>
          {:else}
            <li>
              <slot name="no-results">No results</slot>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</div>
