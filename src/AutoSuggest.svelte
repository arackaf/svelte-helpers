<script>
  import { fade } from "svelte/transition";
  let open = false;

  let currentSearch = "";
  export let options = [];
  export let placeholder = "";

  function onBlur(){ 
    open = false;
    currentSearch = "";
  }
</script>

<style>
  :root {
    --svelte-helpers-auto-complete-border-color: lightgray;
    --svelte-helpers-auto-complete-container-border-radius: 4px;
    --svelte-helpers-auto-complete-container-offset-for-border-radius: 3px;
    --svelte-helpers-auto-complete-item-padding: 5px;
    --svelte-helpers-auto-complete-item-hover-background: lightgray;
    --svelte-helpers-auto-complete-item-hover-cursor: pointer;
  }

  .root {
    display: inline-flex;
    flex-direction: column;
  }

  input {
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 1px solid var(--svelte-helpers-auto-complete-border-color);
    padding: 5px;
    outline: none;
  }

  .items-root {
    position: relative;
  }

  .items-container {
    min-width: calc(100% + var(--svelte-helpers-auto-complete-container-offset-for-border-radius));
    border: 1px solid var(--svelte-helpers-auto-complete-border-color);
    border-radius: var(--svelte-helpers-auto-complete-container-border-radius);
    position: absolute;
    left: calc(-1 * var(--svelte-helpers-auto-complete-container-offset-for-border-radius));
    top: -1px;
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

  li:hover {
    background-color: var(--svelte-helpers-auto-complete-item-hover-background);
    cursor: var(--svelte-helpers-auto-complete-item-hover-cursor);
  }
</style>

<div class="root" class:open>
  <input {placeholder} bind:value={currentSearch} on:focus={() => (open = true)} on:blur={onBlur} />
  {#if open}
    <div transition:fade={{ duration: 150 }} class="items-root">
      <div class="items-container">
        <ul>
          {#each options as option}
            <li>
              <slot name="result" {option}>Hello World FOO Hello World Hello World Hello World Hello World</slot>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</div>
