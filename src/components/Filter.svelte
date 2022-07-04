<script lang="ts">
  import {
    Button,
    FileDropzone,
    FormField,
    Dialog,
    Switch,
    Checkbox,
    Breadcrumbs,
    Loading,
    Divider,
    Modal,
    Slider,
    TextField,
    Autocomplete,
  } from "attractions";

  import { PlusIcon, GithubIcon } from 'svelte-feather-icons';
import { each } from "svelte/internal";


  let containsText = "";
  let linkClicked = false;
  let highlightsClicked = false;
  let imagesClicked = false;
  let pageIndexes = "";
  
  let ranges = [{
        start: 0,
        end: 9,
      }];

  // define the sleep function for async/await
  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async function* getOptions(text) {
    await sleep(1000);
    yield [
      { name: text, details: 'Optional' },
      { name: `it highlights the match: ${text}` },
    ];
  }





</script>




<div>

  <h1>Processing</h1>
  <h2>Find pages that contain...</h2>


    <!-- <Button href="https://github.com/davidus27/pdf-shortener">
        <GithubIcon size="25"/>
    </Button>

    <div>
        <Button >
            <GithubIcon size="25"/>
        </Button>
    </div> -->

    <FormField name="Text:" optional >
      <Autocomplete {getOptions} />
  </FormField>

  <FormField name="Links:" errors={[linkClicked && "Not happy enough"]}>
    <Switch bind:value={linkClicked} />
  </FormField>

  <FormField name="Highlights:" errors={[highlightsClicked && "Not happy enough"]}>
    <Switch bind:value={highlightsClicked} />
  </FormField>

  <FormField name="Images:" errors={[imagesClicked && "Not happy enough"]}>
    <Switch bind:value={imagesClicked} /> 
  </FormField>

  <Divider text="OR"/>

  <h2>Filter pages...</h2>

  <FormField name="Text:" optional>
    <TextField />
    <Button on:click={() => {
      ranges.push({
        start: 0,
        end: 100,
      });
      ranges = ranges
    }}>
      <PlusIcon size="25"/>
    </Button>

    {#each ranges as range}
      <Slider
        value={[2, 4]}
        min={range["start"]}
        max={range["end"]}
        step={1}
        tooltips="never"
        ticks={{ mode: "values", values: [1, 3, 5, 7, 9] }}
      />
    {/each}

    
  </FormField>
</div>
