<script lang="ts">
    import {
        Button,
        Subhead,
        Divider,
        H2,H3,
        Card,
        Accordion,
        AccordionSection,
        Loading,
    } from "attractions";
    import { ChevronDownIcon } from "svelte-feather-icons";

    export let files: File[];
    export let originalPageCount: number[];
    export let newPageCount: number[];
</script>

<div>
    <Divider />
    <div class="accordion">
        <Accordion let:closeOtherPanels>
            <AccordionSection on:panel-open={closeOtherPanels}>
                <div slot="handle" let:toggle>
                    <Button class="summary-btn"
                    on:click={toggle}>
                        <H2>Summary</H2>&nbsp;
                        <ChevronDownIcon
                            size="25"
                            class="ml accordion-chevron"
                        />
                    </Button>
                </div>
                {#if !newPageCount || !originalPageCount}
                    <H3>Loading summary. Please wait...</H3><Loading />
                {:else}
                    {#each files as file, index}
                        <div class="summary-cards">
                            <Card>
                                <div class="accordion-text">
                                    <Subhead
                                        ><b>Document:</b> {file.name}</Subhead
                                    >
                                    <Subhead>
                                        <b>Original No. of pages:</b>
                                        {originalPageCount[index]}
                                    </Subhead>
                                    <Subhead
                                        ><b>New No. of pages:</b>
                                        {newPageCount[index]}</Subhead
                                    >
                                </div>
                            </Card>
                        </div>
                    {/each}
                {/if}
            </AccordionSection>
        </Accordion>
    </div>
</div>

<style>
    .summary-cards {
        margin-bottom: 1em;
    }
    .accordion-text {
        /* align text to the right */
        text-align: left;
    }
</style>
