import { writable } from "svelte/store";
import { ASSIGN_SWAP } from "../../app/keys.js";

export const AssignType = writable(ASSIGN_SWAP);
