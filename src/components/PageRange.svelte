<script lang="ts">
  import {
    Button,
    FormField,
    Slider,
    TextField,
    Label,
    Loading,
  } from "attractions";
  import { PlusIcon } from "svelte-feather-icons";
  import { PageRangeUtility } from "../core";

  export let pageCount: number;
  
  export let textRange: string;
  let ranges: [number, number][] = [];

  let pager = new PageRangeUtility(); 

</script>

<div class="textfield">
  <FormField
    name="Page pageRanges:"
    help="Enter page pageRanges separated by commas. Or use interactive slider by selecting 'Add new range'."
    errors={[
      !pager.textRangeIsCorrect(textRange, pageCount) &&
        "Range in not in a correct format. Note: It can't exceed the boundaries of the page. Ex. 1-3,5,7-10",
    ]}
  >
    <TextField
      class="page-range-input"
      placeholder="e.g. 1-5,8,11-13"
      bind:value={textRange}
      on:change={(event) => {
        if(pager.textRangeIsCorrect(event.detail.value, pageCount)) {
          ranges = pager.updateRanges(event.detail.value, pageCount);
        }
      }}
    />

    <!-- if the pageCount is not ready yet show a loading component -->
    {#if pageCount}
      {#each ranges as pageRange}
        <div class="range">
          <div class="label">
            <Label>
              {#if pageRange[0] == pageRange[1]}
                {pageRange[0]}
              {:else if pageRange[0] > pageRange[1]}
                {pageRange[1]}-{pageRange[0]}
              {:else}
                {pageRange[0]}-{pageRange[1]}
              {/if}
            </Label>
          </div>
          <Slider
            min={1}
            max={pageCount}
            step={1}
            tooltips="active"
            ticks={{ mode: "values", values: pager.generateRange(pageCount), subDensity: 0 }}
            rangeBehavior="free"
            bind:value={pageRange}
            on:change={(e) => {
              pageRange = [e.detail[0], e.detail[1]];
              ranges = ranges;
              textRange = pager.updateTextRange(ranges);
            }}
          />
        </div>
      {/each}

      <div class="add-btn">
        <Button
          on:click={() => {
            ranges.push([1, pageCount]);
            ranges = ranges;
            textRange = pager.updateTextRange(ranges);
          }}
        >
          Add new page range &nbsp;
          <PlusIcon size="25" />
        </Button>
      </div>
    {:else}
      <div class="loading-bar">
        <Loading />
        <Label>&nbsp;&nbsp; Loading page range, please wait...</Label>
      </div>
    {/if}
  </FormField>
</div>

<style>
  .textfield {
    padding: 4vh;
  }
  .range {
    margin-top: 4vw;
    margin-bottom: 4vw;
  }

  .loading-bar {
    /* align horizontally */
    display: flex;
    align-items: center;
    justify-content: center;
    /* add margin at the top */
    margin-top: 0.5em;
  }

  .add-btn {
    /* center the button */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .label {
    margin-bottom: 1vw;
  }
</style>
