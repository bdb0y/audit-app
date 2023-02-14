import {writable} from "svelte/store";

export const is_sidebar_open = writable(false);
export const unitId = writable(-1);
export const gen_token = writable(-1);