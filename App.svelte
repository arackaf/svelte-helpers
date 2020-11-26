<script>
  import AutoSuggest from "./src/AutoSuggest.svelte";

  let options = [
    { name: "Adam" },
    { name: "Laura" },
    { name: "Mark" },
    { name: "Rob" },
    { name: "Jen" },
    { name: "James" },
    { name: "Jason" },
    { name: "Kevin" },
    { name: "Katie" },
    { name: "Mallory" },
    { name: "David" }
  ];
</script>

<style>
  :global(.x) {
    color: red;
  }
</style>

<div style="margin: 100px">
  <AutoSuggest filterField={'name'} placeholder="Search" {options}>
    <div slot="result" let:option>{option.name}</div>
    <span slot="no-results" style="color: blue">No Results, yo</span>
  </AutoSuggest>
</div>
