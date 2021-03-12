<svelte:options immutable={true} />

<script>
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";

  import escapeRegex from "escape-string-regexp";
  import { createMachine, interpret, assign } from "@xstate/fsm";

  export let onItemSelected;
  export let onBlur;
  export let options = [];
  export let placeholder = "";
  export let inputStyles = "";
  export let filterField = "";
  export let displayField = "";
  export let filterByStartsWith = false;
  export let currentSearch = "";
  export let inputProps = {};

  const SLIDE_OPEN = { stiffness: 0.2, damping: 0.7 };
  const SLIDE_CLOSE = { stiffness: 0.3, damping: 0.7 };

  const stateMachine = createMachine(
    {
      initial: "closed",
      context: {
        open: false
      },
      states: {
        closed: {
          on: { OPEN: "open" },
          entry: "closed"
        },
        open: {
          on: {
            RENDERED: { actions: "rendered" },
            RESIZE: { actions: "resize" },
            CLOSE: { actions: "close" },
            CLOSED: "closed",
            OPEN: { actions: "resize" }
          },
          entry: "opened"
        }
      }
    },
    {
      actions: {
        closed: assign(() => ({ open: false })),
        opened: assign(context => {
          return { ...context, open: true };
        }),
        rendered(_, evt) {
          opacitySpring.set(1, { hard: true });
          Object.assign(slideInSpring, SLIDE_OPEN);
          slideInSpring.update(prev => ({ ...prev, width: evt.dimensions.width }), { hard: true });
          slideInSpring.set(evt.dimensions, { hard: false });
        },
        close() {
          opacitySpring.set(0);
          Object.assign(slideInSpring, SLIDE_CLOSE);
          slideInSpring.update(prev => ({ ...prev, height: 0 })).then(() => stateMachineService.send("CLOSED"));
        },
        resize() {
          opacitySpring.set(1);
          slideInSpring.set(getResultsListDimensions());
        }
      }
    }
  );

  const stateMachineService = interpret(stateMachine).start();
  $: open = $stateMachineService.context.open;

  let inputEl = null;
  let inputWidth;
  let filteredOptions = options;
  let selectedIndex = null;
  let focused = false;

  function inputEngaged(evt) {
    stateMachineService.send("OPEN");

    open = true;
    focused = true;
  }

  function inputChanged() {
    if (!open) {
      open = true;
    }
  }

  function inputBlurred() {
    stateMachineService.send("CLOSE");
    focused = false;
    onBlur && onBlur();
  }

  function filterOptions(options) {
    return options.filter(item =>
      new RegExp((filterByStartsWith ? "^" : "") + escapeRegex(currentSearch), "i").test(typeof item === "string" ? item : item[filterField])
    );
  }

  $: {
    filteredOptions = currentSearch ? filterOptions(options) : options;
    selectedIndex = null;
  }

  $: {
    if (resultsList && selectedIndex != null) {
      let allListItems = [...resultsList.querySelectorAll("li")];
      let li = allListItems[selectedIndex];
      li && li.scrollIntoView({ block: "nearest" });
    }
  }

  const slideInSpring = spring({ height: 0, width: 0 });
  const opacitySpring = spring(1, { stiffness: 0.3, damping: 0.7 });

  function getResultsListDimensions() {
    let maxHeightVar = getComputedStyle(document.documentElement).getPropertyValue("--svelte-helpers-auto-complete-results-max-height");
    let maxHeight = parseInt(maxHeightVar, 10);

    let width = Math.max(resultsList.offsetWidth, inputEl.clientWidth);
    let height = Math.min(resultsList.offsetHeight, maxHeight);

    return { width, height };
  }

  let itemsHeightObserver = new ResizeObserver(() => {
    stateMachineService.send("RESIZE");
  });

  let inputWidthObserver = new ResizeObserver(() => {
    inputWidth = inputEl.clientWidth;
  });
  let resultsList;

  function highlightItem(index) {
    index !== selectedIndex && (selectedIndex = index);
  }
  function unhighlightItem(index) {
    if (selectedIndex === index) {
      selectedIndex = null;
    }
  }

  function onSelect(option) {
    if (onItemSelected) {
      onItemSelected(option, inputEl);
    } else if (typeof option === "string") {
      inputEl.value = option;
    } else {
      inputEl.value = option[displayField];
    }
    open = false;
  }

  function keyDown(evt) {
    if (evt.keyCode == 27 && open) {
      open = false;
    } else if (!open && evt.keyCode == 40 && focused) {
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

  onMount(() => {
    inputWidth = inputEl.clientWidth;
    inputWidthObserver.observe(inputEl);

    return () => {
      inputWidthObserver.unobserve(inputEl);
    };
  });

  function resultsListRendered(node) {
    resultsList = node;
    stateMachineService.send({ type: "RENDERED", dimensions: getResultsListDimensions() });
    itemsHeightObserver.observe(resultsList);
    
    return {
      destroy() {
        itemsHeightObserver.unobserve(resultsList);
      }
    };
  }
</script>

<svelte:window on:keydown={keyDown} />

<div class="root" class:open>
  <input
    {placeholder}
    bind:this={inputEl}
    bind:value={currentSearch}
    on:input={inputChanged}
    on:click={inputEngaged}
    on:focus={inputEngaged}
    on:blur={inputBlurred}
    class:open
    style={inputStyles}
    {...inputProps}
  />
  {#if open}
    <div class="options-root">
      <div style="height: {$slideInSpring.height + 'px'}; width: {$slideInSpring.width + 'px'}; opacity: {$opacitySpring}" class="options-container">
        <ul use:resultsListRendered style="min-width: {inputWidth}px">
          {#each filteredOptions as option, index}
            <li
              on:click={() => onSelect(option)}
              on:mousemove={() => highlightItem(index)}
              on:mouseleave={() => unhighlightItem(index)}
              on:mousedown={evt => evt.preventDefault()}
              class="result"
              class:selected={index == selectedIndex}
            >
              <slot name="result" {option}>{typeof option === "string" ? option : option[displayField]}</slot>
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

<style>
  :root {
    --svelte-helpers-auto-complete-border-color: lightgray;
    --svelte-helpers-auto-complete-border-width: 1px;
    --svelte-helpers-auto-complete-border-radius: 4px;
    --svelte-helpers-auto-complete-option-padding: 5px;
    --svelte-helpers-auto-complete-results-max-height: 300px;
    --svelte-helpers-auto-complete-option-hover-background: lightgray;
    --svelte-helpers-auto-complete-option-cursor: pointer;
    --svelte-helpers-auto-complete-options-background-color: white;
  }

  .root {
    display: inline-flex;
    flex-direction: column;
  }

  .root * {
    box-sizing: content-box;
  }

  input {
    border: var(--svelte-helpers-auto-complete-border-width) solid var(--svelte-helpers-auto-complete-border-color);
    border-radius: var(--svelte-helpers-auto-complete-border-radius);
    padding: 5px;
    outline: none;
  }

  .root :global(input.open) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .options-root {
    z-index: 1;
  }

  .options-container {
    margin-top: calc(-1 * var(--svelte-helpers-auto-complete-border-width));
    border: var(--svelte-helpers-auto-complete-border-width) solid var(--svelte-helpers-auto-complete-border-color);
    border-radius: var(--svelte-helpers-auto-complete-border-radius);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    position: absolute;
    max-height: var(--svelte-helpers-auto-complete-results-max-height);
    overflow: auto;
    background-color: var(--svelte-helpers-auto-complete-options-background-color);
  }

  ul {
    padding: 0;
    margin: 0;
    display: inline-block;
  }

  li {
    list-style-type: none;
    white-space: nowrap;
    padding: var(--svelte-helpers-auto-complete-option-padding);
    margin: 0;
  }

  :global(li.result) {
    cursor: var(--svelte-helpers-auto-complete-option-cursor);
  }

  :global(li.selected) {
    background-color: var(--svelte-helpers-auto-complete-option-hover-background);
  }
</style>
