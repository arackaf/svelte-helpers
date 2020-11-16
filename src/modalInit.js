import ModalContainer from "./ModalContainer.svelte";

const container = document.createElement("div");
document.body.appendChild(container);

const overlay = new ModalContainer({
  target: container,
});


