<script lang="ts">
  import { Button, FormField, Slider, TextField, Label } from "attractions";
  import { PlusIcon } from "svelte-feather-icons";

  export let pageCount: number;

  let ranges = [];
  export let textRange = "";

  // function that appends text range from slider values
  const updateTextRange = () => {
    let textRange = "";

    // iterate over an range array
    for (let rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
      let range = ranges[rangeIndex];

      if (range.start === range.end) {
        textRange += `${range.start},`;
      } else if (range.start > range.end) {
        range = { start: range.end, end: range.start };
        textRange += `${range.start}-${range.end},`;
      } else {
        textRange += `${range.start}-${range.end},`;
      }
    }
    // remove last comma
    return textRange.slice(0, -1);
  };

  // create function generateRange() that generates sequence of numbers from 1 to pageCount
  // step will be based on pageCount divided by 2
  const generateRange = () => {
    const separator = pageCount <= 10 ? pageCount : pageCount / 5;
    const step = Math.ceil(pageCount / separator);
    let range = [];
    let command: number;
    range.push(1);
    for (let i = 1; i <= pageCount; i += step) {
      command = i + step - 1;

      if (command > pageCount) {
        command = pageCount;
      }
      range.push(command);
    }
    return range;
  };
</script>

<div class="textfield">
  <FormField 
    name="Page ranges:"
    help="Enter page ranges separated by commas. Or use interactive slider by selecting 'Add new range'."
    >
    <TextField class="page-range-input" placeholder="e.g. 1-5,8,11-13" bind:value={textRange} />

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


        <Slider
          value={[range.start, range.end]}
          min={1}
          max={pageCount}
          step={1}
          tooltips="active"
          ticks={{ mode: "values", values: generateRange(), subDensity: 0 }}
          rangeBehavior="free"
          on:change={(e) => {
            range = {
              start: e.detail[0],
              end: e.detail[1],
            };
            textRange = updateTextRange();
            console.log(ranges);
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
          ranges = ranges;
        }}
      >
      Add new range &nbsp;
        <PlusIcon size="25" />
      </Button>
    </div>
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

  .add-btn {
    /* center the button */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .label {
    margin-bottom: 1vw;;
  }
</style>
