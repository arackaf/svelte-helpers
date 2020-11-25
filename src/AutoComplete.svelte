<script>
  import { fade } from "svelte/transition"
  let open = false;

  export let options = [];
</script>

<style>
  :root {
    --svelte-helpers-auto-complete-border-color: lightgray;
    --svelte-helpers-auto-complete-container-border-radius: 4px;
    --svelte-helpers-auto-complete-input-offset-for-border-radius: 3px;
  }
  .root {
    display: inline-flex;
    flex-direction: column;
    margin-left: calc(-1 * var(--svelte-helpers-auto-complete-input-offset-for-border-radius));
  }

  .root input {
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 1px solid var(--svelte-helpers-auto-complete-border-color);
    padding: 5px;

    margin-left: var(--svelte-helpers-auto-complete-input-offset-for-border-radius);
    outline: none;
  }

  .root .items-root {
    position: relative;
  }

  .root .items-container {
    border: 1px solid var(--svelte-helpers-auto-complete-border-color);
    border-radius: var(--svelte-helpers-auto-complete-container-border-radius);
    /* border-top-left-radius: 0; */
    position: absolute;
    left: 0;
    top: -1px;
    padding: 5px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style-type: none;
    white-space: nowrap;
  }
</style>

<div class="root" class:open>
  <input on:focus={() => (open = true)} on:blur={() => (open = false)} />
  {#if open}
    <div transition:fade={{ duration: 150 }} class="items-root">
      <div class="items-container">
        <ul>
          <li>Hello World <span>Hello World</span> Hello World</li>
        </ul>
      </div>
    </div>
  {/if}
</div>
