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

  let books = [];

  const booksUrl = "https://mylibrary.io/graphql-public?query={allBooks(PAGE:1,PAGE_SIZE:30,SORT:{title: 1}){Books{title,smallImage,isRead}}}";
  fetch(booksUrl)
    .then(resp => resp.json())
    .then(res => (books = res.data.allBooks.Books));
</script>

<style>
  .root {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .root > :global(*) {
    margin-right: 10px;
  }
  .bookResult {
    display: flex;
    flex-direction: row;
  }

  .book-img {
    width: 60px;
    margin-right: 5px;
  }
</style>

<div class="root" style="margin: 100px">
  <AutoSuggest filterField={'name'} displayField="name" placeholder="Search" {options}>
    <div slot="result" let:option>{option.name}</div>
    <span slot="no-results" style="color: blue">No Results, yo</span>
  </AutoSuggest>

  <AutoSuggest filterField="title" displayField="title" placeholder="Search" options={books}>
    <div slot="result" class="bookResult" let:option><span class="book-img"><img src={option.smallImage} alt="" /></span> <span>{option.title}</span></div>
    <span slot="no-results" style="color: blue">No Results, yo</span>
  </AutoSuggest>
</div>
