<script>
  import AutoSuggest from "./src/AutoSuggest.svelte";

  let options = [
    { name: "Adam" },
    { name: "Laura" },
    { name: "Mark" },
    { name: "Rob" },
    { name: "Jen" }
  ];
</script>

<style>
  :global(.x) {
    color: red;
  }
</style>

<AutoSuggest placeholder="Search" {options}>
  <div let:option slot="result">{option.name}</div>
</AutoSuggest>
