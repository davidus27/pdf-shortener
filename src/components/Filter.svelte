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
    Label
  } from "attractions";

  import PageRange from "./PageRange.svelte";

  import { PlusIcon } from "svelte-feather-icons";

  export let formData = {
    containsText: [],
    linkClicked: false,
    highlightsClicked: false,
    imagesClicked: false,
    textRange: ""
  };

  async function* getOptions(text: string) {
    yield [
      { name: text, details: "Optional" },
      { name: `it highlights the match: ${text}` },
    ];
  }

  export let pageCount: number = 0;
</script>

<div class="filter">
  <Headline>Processing</Headline>
  <Subhead>Find pages that contain...</Subhead>

  <FormField name="Pages containing text:" optional>
    <Autocomplete {getOptions} bind:selection={formData.containsText} />
  </FormField>

  <FormField
    name="Highlights:"
    errors={[formData.highlightsClicked && "PDF pages containing highlighted annotations."]}
  >
    <Switch bind:value={formData.highlightsClicked} />
  </FormField>

  <FormField name="Links:" errors={[formData.linkClicked && "PDF pages containing links."]}>
    <Switch bind:value={formData.linkClicked} />
  </FormField>

  <FormField name="Images:" errors={[formData.imagesClicked && "PDF pages containing images."]}>
    <Switch bind:value={formData.imagesClicked} />
  </FormField>

  <Divider text="AND" />

  <h2>Filter pages...</h2>
  <PageRange bind:textRange={formData.textRange} bind:pageCount/>
  

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
