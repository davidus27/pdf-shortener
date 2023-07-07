<script lang="ts">
  import {
    Button,
    FormField,
    Switch,
    Autocomplete,
    Headline,
    Subhead,
    Divider,
    H2,
    Card,
  } from "attractions";
  import type { DocumentFilters } from "../core/PDFLogic";
  import MyDivider from "./Divider.svelte";

  import PageRange from "./PageRange.svelte";

  import { PlusIcon } from "svelte-feather-icons";

  export let formData: DocumentFilters = {
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
  };

  function getOptions(text: string) {
    return [
      { name: text, details: "Optional" },
      { name: `it highlights the match: ${text}` },
    ];
  }

  export let pageCount: number;
</script>

<div class="filter">
  <Headline>Checkout</Headline>
  <Subhead style="padding-bottom: 1em;"
    >New document(s) will only contain pages complying with these rules:</Subhead
  >

  <Divider />
  <H2>1. Keywords</H2>
  <div class="keywords-form">
    <FormField
      name="Pages containing specified keywords:"
      help="Enter one or more keywords to search for in the document. The final document will contain pages containing those keywords."
    >
      <Autocomplete
        class="pages-contains"
        {getOptions}
        bind:selection={formData.keywords.words}
      />
    </FormField>
  </div>

  <MyDivider bind:selected={formData.keywords.logicOperator} />
  <H2 style="padding-bottom: 2em">2. Checks</H2>

  <FormField
    name="Pages containing highlights:"
    help="New document will include pages containing highlighted text"
  >
    <Switch
      class="highlight-switch"
      bind:value={formData.checks.hasHighlights}
    />
  </FormField>

  <div class="or"><Subhead>OR...</Subhead></div>

  <FormField
    name="Pages containing links:"
    help="New document will include pages containing links."
  >
    <Switch class="links-switch" bind:value={formData.checks.hasLinks} />
  </FormField>

  <div class="or"><Subhead>OR...</Subhead></div>

  <FormField
    name="Pages containing images:"
    help="New document will include pages containing images."
  >
    <Switch class="images-switch" bind:value={formData.checks.hasImages} />
  </FormField>

  <MyDivider bind:selected={formData.checks.logicOperator} />

  <H2>3. Page ranges</H2>
  <PageRange bind:textRange={formData.textRange} bind:pageCount />
</div>

<style>
  /* make filter center */
  .filter {
    justify-content: center;
    /* add padding */
    padding: 1em;
    /* make filter fit the viewport */
    max-width: 100vw;
    margin: 0 auto;
  }

  .keywords-form {
    /* add a space at the top */
    padding-top: 2em;
  }

  .or {
    padding-bottom: 2em;
  }
</style>
