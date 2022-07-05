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

  let containsText = "";
  let linkClicked = false;
  let highlightsClicked = false;
  let imagesClicked = false;
  let pageIndexes = "";

  let ranges = [
    {
      start: 1,
      end: 10,
    },
  ];

  // define the sleep function for async/await
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function* getOptions(text: string) {
    // await sleep(1000);
    yield [
      { name: text, details: "Optional" },
      { name: `it highlights the match: ${text}` },
    ];
  }
</script>

<div class="filter">
  <Headline>Processing</Headline>
  <Subhead>Find pages that contain...</Subhead>

  <FormField name="Pages containing text:" optional>
    <Autocomplete {getOptions} />
  </FormField>

  <FormField
    name="Highlights:"
    errors={[highlightsClicked && "PDF pages containing highlighted annotations."]}
  >
    <Switch bind:value={highlightsClicked} />
  </FormField>

  <FormField name="Links:" errors={[linkClicked && "PDF pages containing links."]}>
    <Switch bind:value={linkClicked} />
  </FormField>

  <FormField name="Images:" errors={[imagesClicked && "PDF pages containing images."]}>
    <Switch bind:value={imagesClicked} />
  </FormField>

  <Divider text="AND" />

  <h2>Filter pages...</h2>
  <PageRange />
  

  <Divider />
  <Button
    on:click={() => {
      
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
