import ModalContainer from "./ModalContainer.svelte";

if (typeof window !== "undefined") {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const overlay = new ModalContainer({
    target: container
  });
}
