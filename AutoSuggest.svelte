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

  const stateMachine = createMachine(
    {
      initial: "closed",
      context: {
        open: false,
        rendered: false,
        x: 12,
        y: 13
      },
      states: {
        closed: { on: { OPEN: "opening" }, entry: "closed" },
        opening: { on: { OPENED: "open", actions: "opened" }, entry: "opening" },
        open: {
          on: {
            CLOSE: "closing",
            RESIZE: { target: "open", actions: "resize" }
          }
        },
        closing: { on: { CLOSED: "closed" }, entry: "closing" }
      }
    },
    {
      actions: {
        closed(context) {
          console.log("ACTION", context, "closed");
        },
        opening: assign(context => {
          console.log("ACTION", context, "opening");
          return { ...context, open: true };
        }),
        opened(context) {
          console.log("ACTION", context, "opened");
        },
        closing(context) {
          console.log("ACTION", context, "closing");
        },
        resize(context) {
          console.log("ACTION", context, "resize");
        }
      }
    }
  );

  const stateMachineService = interpret(stateMachine).start();

  $: currentState = $stateMachineService.context;

  $: {
    let open = currentState.open;
    console.log("OPEN CHANGED TO", open);
  }

  stateMachineService.subscribe((state, x) => {
    console.log("state", state, state.value, x);
  });

  let open = false;
  let resultsListVisible = false;
  let resultsListHasRendered = false;
  let inputEl = null;
  let inputWidth;
  let filteredOptions = options;
  let selectedIndex = null;
  let focused = false;
  let closing = false;

  function inputEngaged(evt) {
    stateMachineService.send("OPEN");
    setTimeout(() => {
      stateMachineService.send("OPENED");
    }, 2000);

    if (closing) {
      setSpringDimensions();
    }
    open = true;
    focused = true;
    resultsListVisible = true;
  }

  function inputChanged() {
    if (!open) {
      open = true;
    }
  }

  function inputBlurred() {
    closing = true;
    open = false;
    focused = false;
    onBlur && onBlur();
    setSpringDimensions(false, true);
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

  const SLIDE_OPEN = { stiffness: 0.2, damping: 0.7 };
  const SLIDE_CLOSE = { stiffness: 0.2, damping: 0.7 };
  const slideInSpring = spring({ height: 0, width: 0 });
  const opacitySpring = spring(1, { stiffness: 0.3, damping: 0.7 });

  function setSpringDimensions(opening, closing) {
    let maxHeightVar = getComputedStyle(document.documentElement).getPropertyValue("--svelte-helpers-auto-complete-results-max-height");
    let maxHeight = parseInt(maxHeightVar, 10);

    let width = Math.max(resultsList.offsetWidth, inputEl.clientWidth);
    let height = Math.min(resultsList.offsetHeight, maxHeight);

    if (opening) {
      opacitySpring.set(1, { hard: true });
      Object.assign(slideInSpring, SLIDE_OPEN);
      slideInSpring.set({ width, height: 0 }, { hard: true });
      slideInSpring.set({ width, height }).then(() => {
        itemsHeightObserver.observe(resultsList);
      });
    } else if (closing) {
      opacitySpring.set(0);
      Object.assign(slideInSpring, SLIDE_CLOSE);
      slideInSpring
        .update(({ width }) => ({ height: 0, width }))
        .then(() => {
          resultsListVisible = false;
        });
    } else {
      Object.assign(slideInSpring, SLIDE_OPEN);
      slideInSpring.set({ height, width });
      opacitySpring.set(1, { hard: true });
    }
  }

  let itemsHeightObserver = new ResizeObserver(() => {
    stateMachineService.send("RESIZE");
    setSpringDimensions();
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
    console.log(evt.keyCode);
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
    setSpringDimensions(true);
    resultsListHasRendered = true;

    return {
      destroy() {
        resultsListHasRendered = false;
        closing = false;
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
  {#if resultsListVisible}
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
