import { writable } from "svelte/store";

const modalStore = writable({
  modals: [],
});

export default modalStore;
