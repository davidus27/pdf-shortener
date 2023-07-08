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
  import { PageRange } from "../core";

  const pageRange = new PageRange();
  export let pageCount: number;

  let ranges = [];
  export let textRange = "";

</script>

<div class="textfield">
  <FormField
    name="Page ranges:"
    help="Enter page ranges separated by commas. Or use interactive slider by selecting 'Add new range'."
    errors={[
      !pageRange.textRangeIsCorrect(textRange, pageCount) &&
        "Range in not in a correct format. Note: It can't exceed the boundaries of the page. Ex. 1-3,5,7-10",
    ]}
  >
    <TextField
      class="page-range-input"
      placeholder="e.g. 1-5,8,11-13"
      bind:value={textRange}
      on:change={(e) => {
        console.log(ranges);
        textRange = e.target.value;
        ranges = pageRange.updateRanges();
      }}
    />

    <!-- if the pageCount is not ready yet show a loading component -->
    {#if pageCount}
      {#each ranges as range}
        <div class="range">
          <div class="label">
            <Label>
              {#if range.start == range.end}
                {range.start}
              {:else if range.start > range.end}
                {range.end}-{range.start}
              {:else}
                {range.start}-{range.end}
              {/if}
            </Label>
          </div>
          <!-- value={[range.start, range.end]} -->
          <Slider
            min={1}
            max={pageCount}
            step={1}
            tooltips="active"
            ticks={{ mode: "values", values: pageRange.generateRange(pageCount), subDensity: 0 }}
            rangeBehavior="free"
            bind:value={range}
            on:change={(e) => {
              console.log("changed:", pageCount);

              range = {
                start: e.detail[0],
                end: e.detail[1],
              };
              textRange = pageRange.updateTextRange();
            }}
          />
        </div>
      {/each}

      <div class="add-btn">
        <Button
          on:click={() => {
            ranges.push({
              start: 1,
              end: pageCount,
            });
            textRange = pageRange.updateTextRange();
            ranges = ranges;
          }}
        >
          Add new range &nbsp;
          <PlusIcon size="25" />
        </Button>
      </div>
    {:else}
      <div class="loading-bar">
        <Loading />
        <Label>&nbsp;&nbsp; Loading page ranges, please wait...</Label>
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
