<script lang="ts">
    import {
        Button,
        Subhead,
        Divider,
        H2,
        Card,
        Accordion,
        AccordionSection,
    } from "attractions";
    import { ChevronDownIcon } from "svelte-feather-icons";

    export let files: File[];
    export let originalPageCount: number;
    export let newPageCount: number;
</script>

<div>
    <Divider />
    <!-- <Button
      on:click={() => {
        console.log(formData);
      }}
    >
      <PlusIcon size="25" />
    </Button> -->
    <div class="accordion">
        <Accordion let:closeOtherPanels>
            <AccordionSection on:panel-open={closeOtherPanels}>
                <div slot="handle" let:toggle>
                    <Button on:click={toggle}>
                        <H2>Summary</H2>&nbsp;
                        <ChevronDownIcon size="25" class="ml accordion-chevron" />
                    </Button>
                </div>
                {#each files as file}
                    <Card>
                        <div class="accordion-text">
                            <Subhead><b>Document:</b> {file.name}</Subhead>
                            <Subhead><b>Original No. of pages:</b> {originalPageCount}</Subhead>
                            <Subhead><b>New No. of pages:</b> {newPageCount}</Subhead>
                        </div>
                    </Card>
                {/each}
            </AccordionSection>
        </Accordion>
    </div>
    
</div>

<style> 
    .accordion-text {
        /* align text to the right */
        text-align: left;
    }
</style>
