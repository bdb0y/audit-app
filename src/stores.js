import {writable} from "svelte/store";

export const is_sidebar_open = writable(false);
export const unitId = writable(-1);
export const gen_token = writable(-1);
export const sso_firstName = writable("");
export const sso_lastName = writable("");
export const sso_departmentName = writable("");
export const sso_workPlaceSlug = writable("");
export const sso_workPlaceName= writable("");
export const sso_departmentId = writable("");
export const sso_unitId = writable("");
export const sso_personCode = writable("");
export const the_selected_topic = writable();