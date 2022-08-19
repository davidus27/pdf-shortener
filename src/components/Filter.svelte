<script lang="ts">
  import {
    Button,
    FormField,
    Switch,
    Divider,
    Slider,
    TextField,
    Autocomplete,
    Headline,
    Subhead,
    Label,
  } from "attractions";
  import type { DocumentFilters } from "../pdf";

  import PageRange from "./PageRange.svelte";

  import { PlusIcon } from "svelte-feather-icons";

  export let formData: DocumentFilters = {
    containsTexts: [],
    hasHighlights: false,
    hasImages: false,
    hasLinks: false,
    textRange: "",
  };

  async function* getOptions(text: string) {
    yield [
      { name: text, details: "Optional" },
      { name: `it highlights the match: ${text}` },
    ];
  }

  export let pageCount: number;
</script>

<div class="filter">
  <Headline>Processing</Headline>
  <Subhead>Find pages that contain...</Subhead>

  <div >
    <FormField name="Pages containing text:" optional>
      <Autocomplete class="pages-contains" {getOptions} bind:selection={formData.containsTexts} />
    </FormField>
  </div>

    <FormField
      name="Highlights:"
      errors={[formData.hasHighlights && "PDF pages containing highlighted annotations."]}
    >
      <Switch class="highlight-switch" bind:value={formData.hasHighlights} />
    </FormField>

    <FormField
      name="Links:"
      errors={[formData.hasLinks && "PDF pages containing links."]}
    >
      <Switch class="links-switch" bind:value={formData.hasLinks} />
    </FormField>

    <FormField
      name="Images:"
      errors={[formData.hasImages && "PDF pages containing images."]}
    >
      <Switch class="images-switch" bind:value={formData.hasImages} />
    </FormField>

  <Divider text="AND" />

  <h2>Filter pages...</h2>
  <PageRange bind:textRange={formData.textRange} bind:pageCount />

  <Divider />
  <Button
    on:click={() => {
      console.log(formData);
    }}
  >
    <PlusIcon size="25" />
  </Button>
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
</style>
