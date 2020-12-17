import { writable } from "svelte/store";

const modalStore = writable({
  modals: []
});

const blockedModals = new Set([]);

export function renderModal(props) {
  if (blockedModals.has(props.node)) {
    return;
  }
  modalStore.update(state => ({ ...state, modals: [...state.modals, props] }));
}

export function unRenderModal(contentNode) {
  modalStore.update(state => ({ ...state, modals: state.modals.filter(d => d.node != contentNode) }));
}

export function blockModal(contentNode) {
  blockedModals.add(contentNode);
}

export function releaseModal(contentNode) {
  blockedModals.delete(contentNode);
}

export default modalStore;
