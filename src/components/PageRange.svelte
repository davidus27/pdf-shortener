<script>
    import {
        Button,
        FormField,
        Slider,
        TextField,
        Label
    } from "attractions";
    import { PlusIcon } from "svelte-feather-icons";

    export let ranges = [
        {
        start: 1,
        end: 10,
        },
    ];
    let textRange = "";

    // function that appends text range from slider values
    const updateTextRange = () => {
        textRange = "";
        // iterate over ranges array
        ranges.forEach((range) => {
            textRange += `${range.start}-${range.end},`;
        });
        // remove last comma
        textRange = textRange.slice(0, -1);
    };
    
</script>

<div>

    <FormField name="Page range:" optional>
        <div class="textfield">
            <TextField placeholder="e.g. 1-5,8,11-13" bind:value={textRange} />
        </div>
    
        {#each ranges as range}
          <div class="range">
            <Slider
              value={[range.start, range.end]}
              min={1}
              max={10}
              step={1}
              tooltips="never"
              ticks={{ mode: "values", values: [...Array(10).keys()] }}
              on:change={(e) => {
                console.log(e.detail);
                range = {
                    start: e.detail[0],
                    end: e.detail[1],
                };
                textRange = updateTextRange();
              }}
            />
            <Label>{range.start}-{range.end}</Label>
          </div>
        {/each}
    
        <Button
        on:click={() => {
          ranges.push({
            start: 1,
            end: 10,
          });
          ranges = ranges;
        }}
      >
        <PlusIcon size="25" />
      </Button>
      </FormField>
</div>


<style>
    .textfield {
        padding: 4vh;
    }
    .range {
    margin-bottom: 4vw;
    }
</style>