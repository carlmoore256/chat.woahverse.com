import { writable } from "svelte/store";

let initialSession = localStorage.getItem("currentSession") || null;
if (initialSession) {
    initialSession = JSON.parse(initialSession);
}

export const currentSession = writable(initialSession);

currentSession.subscribe((value) => {
    localStorage.setItem("currentSession", JSON.stringify(value));
});