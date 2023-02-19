import { SvelteComponentTyped } from "svelte";

export default class Modal extends SvelteComponentTyped<
  {
    open?: boolean;
    useContentWidth?: boolean;
    deferStateChangeOnClose?: boolean;
    modalKey?: string;
    animateResizing?: boolean;
    closeModal?: () => void;
  },
  {
    [evt: string]: CustomEvent<any>;
  },
  {
    
  }
> {}
