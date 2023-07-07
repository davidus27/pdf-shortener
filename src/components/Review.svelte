<script lang="ts">
  import {
    Button,
    Card,
    Headline,
    Accordion,
    AccordionSection,
    H2,
    Subhead,
  } from "attractions";
  
  import {Executor as ExecuteProcesses }  from "../core";

  import { ChevronDownIcon } from "svelte-feather-icons";
  import { onMount } from "svelte";
  import InfoSummary from "./InfoSummary.svelte";

  export let files: Array<File>;
  export let formData: any;

  let originalPageCount: number[];
  let newPageCount: number[];

  let executor = new ExecuteProcesses(files, formData);

  onMount(async () => {
    await executor.renderDocuments();
    originalPageCount = executor.getOriginalPageCount();
    newPageCount = await executor.getPageCount();
  });

  const handleDownload = async () => {
    await executor.downloadAllDocuments();
  };
</script>

<div>
  <Headline>Summary</Headline>
  <!-- <InfoSummary bind:files bind:originalPageCount bind:newPageCount /> -->

  <!-- Preview -->
  <Accordion let:closeOtherPanels>
    <AccordionSection on:panel-open={closeOtherPanels}>
      <div slot="handle" let:toggle>
        <Button on:click={toggle}>
          <H2>Preview pages</H2>&nbsp;
          <ChevronDownIcon size="25" class="ml accordion-chevron" />
        </Button>
      </div>
      <Card>
        <div id="pdf-viewer" />
      </Card>
    </AccordionSection>
  </Accordion>
  <!-- <div id='pdf-viewer'></div> -->
  <!-- <Card id='pdf-viewer'>
    <div id='pdf-viewer'></div>
  </Card> -->

  <div class="process-btn">
    <Button danger filled on:click={handleDownload}>Download</Button>
  </div>
</div>

<style>
  /* move submit-btn to the relative right side of the screen */
  .process-btn {
    float: right;
    /* add some padding */
    padding: 20px;
  }
</style>
