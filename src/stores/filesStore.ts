import { writable } from 'svelte/store';

export const files = writable<File[]>([]);

export const originalPageCounts = writable<number[]>([]);
export const filteredPageCounts = writable<number[]>([]);