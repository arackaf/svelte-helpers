<script>
  import escapeRegex from "escape-string-regexp";
  import { spring } from "svelte/motion";
  import { fade, slide } from "svelte/transition";
  let open = false;

  export let options = [];
  export let placeholder = "";
  export let filterField = "";
  export let displayField = "";

  let inputEl = null;
  let currentSearch = "";
  let filteredOptions = options;
  let selectedIndex = null;

  function onBlur() {
    open = false;
  }

  function inputEngaged() {
    open = true;
  }

  function inputChanged() {
    if (!open) {
      open = true;
    }
  }

  function filterOptions() {
    return options.filter(item => new RegExp(escapeRegex(currentSearch), "i").test(item[filterField]));
  }

  $: {
    filteredOptions = currentSearch ? filterOptions() : options;
    selectedIndex = null;
  }

  $: {
    if (resultsList && selectedIndex != null) {
      let allListItems = [...resultsList.querySelectorAll("li")];
      let li = allListItems[selectedIndex];
      li && li.scrollIntoView({ block: "nearest" });
    }
  }

  let animateContainerHeight = false;
  const slideInSpring = spring(0, { stiffness: 0.2, damping: 0.7 });

  function setSpringHeight(height, hard) {
    let maxHeightVar = getComputedStyle(document.documentElement).getPropertyValue("--svelte-helpers-auto-complete-results-max-height");
    let maxHeight = parseInt(maxHeightVar, 10);

    slideInSpring.set(Math.min(resultsList.offsetHeight, maxHeight), hard ? { hard: true } : void 0);
  }

  let itemsHeightObserver = new ResizeObserver(([{ contentRect }]) => {
    setSpringHeight(contentRect.height);
  });
  let resultsList;

  function opening() {}
  function opened() {
    setSpringHeight(resultsList.offsetHeight, true);

    animateContainerHeight = true;
    itemsHeightObserver.observe(resultsList);
  }
  function closing() {
    itemsHeightObserver.unobserve(resultsList);
    animateContainerHeight = false;
  }
  function closed() {}

  function highlightItem(index) {
    index !== selectedIndex && (selectedIndex = index);
  }
  function unhighlightItem(index) {
    if (selectedIndex === index) {
      selectedIndex = null;
    }
  }

  function onSelect(option) {
    if (typeof option === "string") {
      inputEl.value = option;
    } else {
      inputEl.value = option[displayField];
    }
  }

  function keyDown(evt) {
    if (!open && evt.keyCode == 40) {
      open = true;
    } else if (open && filteredOptions.length) {
      if (evt.keyCode == 40) {
        if (selectedIndex == null) {
          selectedIndex = 0;
        } else {
          selectedIndex = selectedIndex == filteredOptions.length - 1 ? 0 : selectedIndex + 1;
        }
      } else if (evt.keyCode == 38) {
        if (selectedIndex == null) {
          selectedIndex = filteredOptions.length - 1;
        } else {
          selectedIndex = selectedIndex == 0 ? filteredOptions.length - 1 : selectedIndex - 1;
        }
      } else if (evt.keyCode == 13) {
        if (selectedIndex != null) {
          onSelect(filteredOptions[selectedIndex]);
          open = false;
        }
      }
    }
  }
</script>

<style>
  :root {
    --svelte-helpers-auto-complete-border-color: lightgray;
    --svelte-helpers-auto-complete-border-width: 1px;
    --svelte-helpers-auto-complete-border-radius: 4px;
    --svelte-helpers-auto-complete-item-padding: 5px;
    --svelte-helpers-auto-complete-results-max-height: 200px;
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
    max-height: var(--svelte-helpers-auto-complete-results-max-height);
    overflow: auto;
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

  :global(li.result) {
    cursor: var(--svelte-helpers-auto-complete-item-hover-cursor);
  }

  :global(li.selected) {
    background-color: var(--svelte-helpers-auto-complete-item-hover-background);
  }
</style>

<svelte:window on:keydown={keyDown} />
<h1>{$slideInSpring}</h1>

<div class="root" class:open>
  <input
    {placeholder}
    bind:this={inputEl}
    bind:value={currentSearch}
    on:input={inputChanged}
    on:click={inputEngaged}
    on:focus={inputEngaged}
    on:blur={onBlur}
    class:open />
  {#if open}
    <div
      transition:fade={{ duration: 150 }}
      class="items-root"
      on:introstart={opening}
      on:introend={opened}
      on:outrostart={closing}
      on:outroend={closed}>
      <div style="height: {animateContainerHeight ? $slideInSpring + 'px' : 'auto'}" class="items-container">
        <ul bind:this={resultsList}>
          {#each filteredOptions as option, index}
            <li
              on:click={() => onSelect(option)}
              on:mousemove={() => highlightItem(index)}
              on:mouseleave={() => unhighlightItem(index)}
              class="result"
              class:selected={index == selectedIndex}>
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
