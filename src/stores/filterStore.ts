// define the filter store
import { writable } from 'svelte/store';
import type { DocumentFilters } from '../core';

// define the filter store
export const formData = writable<DocumentFilters>({
    keywords: {
        words: [],
        logicOperator: "OR",
    },
    checks: {
        logicOperator: "AND",
        hasHighlights: true,
        hasImages: false,
        hasLinks: false,
    },
    textRange: "",
});