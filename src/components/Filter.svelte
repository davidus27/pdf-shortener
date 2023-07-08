<script lang="ts">
  import {
    FormField,
    Switch,
    Autocomplete,
    Headline,
    Subhead,
    Divider,
    H2,
  } from "attractions";
  import MyDivider from "./general/Divider.svelte";
  import PageRange from "./general/PageRange.svelte";

  import { formData } from "../stores/filterStore";
  import { originalPageCounts } from "../stores/filesStore";

  function* getOptions(text: string) {
    yield [
      { name: text, details: `You are looking for ${text}` },
    ];
  }

  /** 
   * TODO: currently the filter is applied on all files in the list same way
   * in future we may want to apply different filters on different files
   * so we need to change the filterStore to be an array of filters
   * this would be a pageCounts. Now we select page count of longest document
  */
  $: pageCount = Math.max(...$originalPageCounts);

  // export let pageCount: number;
</script>

<div class="filter">
  <Headline>Checkout</Headline>
  <Subhead style="padding-bottom: 1em;"
    >New document(s) will only contain pages complying with these rules:</Subhead
  >
  <Divider />

  <!-- First filter -->
  <H2>1. Keywords</H2>
  <div class="keywords-form">
    <FormField
      name="Pages containing specified keywords:"
      help="Enter one or more keywords to search for in the document. The final document will contain pages containing those keywords."
    >
      <Autocomplete
        class="pages-contains"
        {getOptions}
        bind:selection={$formData.keywords.words}
      />
    </FormField>
  </div>

  <MyDivider bind:selected={$formData.keywords.logicOperator} />

  <!-- Second filters -->
  <H2 style="padding-bottom: 2em">2. Checks</H2>

  <FormField
    name="Pages containing highlights:"
    help="New document will include pages containing highlighted text"
  >
    <Switch
      class="highlight-switch"
      bind:value={$formData.checks.hasHighlights}
    />
  </FormField>

  <div class="or"><Subhead>OR...</Subhead></div>

  <FormField
    name="Pages containing links:"
    help="New document will include pages containing links."
  >
    <Switch class="links-switch" bind:value={$formData.checks.hasLinks} />
  </FormField>

  <div class="or"><Subhead>OR...</Subhead></div>

  <FormField
    name="Pages containing images:"
    help="New document will include pages containing images."
  >
    <Switch class="images-switch" bind:value={$formData.checks.hasImages} />
  </FormField>

  <MyDivider bind:selected={$formData.checks.logicOperator} />

  <!-- Third filter -->
  <H2>3. Page ranges</H2>
  <PageRange bind:textRange={$formData.textRange} bind:pageCount />
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
