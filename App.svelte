<script>
  import AutoComplete from "./src/AutoComplete.svelte";

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

<AutoComplete placeholder="Search" {options}>
  <div let:option slot="result">{option.name}</div>
</AutoComplete>
