<script>
  import AutoSuggest from "../AutoSuggest.svelte";

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

  let selectedBook;
  function onBookSelected(option, input) {
    selectedBook = option.title;
    input.value = "";
  }
</script>

<style>
  .root {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 25px 0 0 25px;
  }
  h3 {
    margin: 0 0 10px 0;
  }
  .root > :global(*) {
    margin-right: 10px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid gray;
  }
  .bookResult {
    display: flex;
    flex-direction: row;
  }

  .book-img {
    width: 60px;
    margin-right: 5px;
  }

  .book-title {
    max-width: 500px;
    text-overflow: ellipsis;
    overflow: hidden;
    padding-right: 10px;
    display: block;
  }
</style>

<div class="root">
  <div>
    <h3>String options</h3>
    <AutoSuggest filterField={'name'} displayField="name" placeholder="Search" options={options.map(item => item.name)}>
      <div slot="result" let:option>{option}</div>
      <span slot="no-results">No Results :(</span>
    </AutoSuggest>
  </div>

  <div>
    <h3>Object options</h3>
    <AutoSuggest filterField={'name'} displayField="name" placeholder="Search" {options}>
      <div slot="result" let:option>{option.name}</div>
      <span slot="no-results">No Results :(</span>
    </AutoSuggest>
  </div>

  <div>
    <h3>Search by string start</h3>
    <AutoSuggest filterField={'name'} displayField="name" placeholder="Search" {options}>
      <div slot="result" let:option>{option.name}</div>
      <span slot="no-results">No Results :(</span>
    </AutoSuggest>
  </div>

  <div>
    <h3>Arbitrary option formatting</h3>
    <AutoSuggest filterField="title" displayField="title" placeholder="Search" options={books}>
      <div slot="result" class="bookResult" let:option>
        <span class="book-img"><img src={option.smallImage} alt="" /></span>
        <span class="book-title">{option.title}</span>
      </div>
      <span slot="no-results">No Results :(</span>
    </AutoSuggest>
  </div>

  <div>
    <h3>Custom on handler for selected item</h3>
    <AutoSuggest filterField="title" onItemSelected={onBookSelected} placeholder="Search" options={books}>
      <div slot="result" class="bookResult" let:option>
        <span class="book-img"><img src={option.smallImage} alt="" /></span>
        <span class="book-title">{option.title}</span>
      </div>
      <span slot="no-results">No Results :(</span>
    </AutoSuggest>
    <br /><br />
    Selected:
    {selectedBook}
  </div>
</div>
