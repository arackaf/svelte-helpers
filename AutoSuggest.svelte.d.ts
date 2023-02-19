import { SvelteComponentTyped } from "svelte";

export default class AutoSuggest extends SvelteComponentTyped<
  {
    onItemSelected?: any;
    onBlur?: () => void;
    options?: any[];
    placeholder?: string;
    inputStyles?: string;
    filterField?: string;
    keyField?: string;
    displayField?: string;
    filterByStartsWith?: boolean;
    currentSearch?: string;
    noFiltering?: boolean;
    inputProps?: any;
  },
  {
    [evt: string]: CustomEvent<any>;
  },
  {
    result: { option: any };
  }
> {}
