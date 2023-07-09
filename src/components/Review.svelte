<script lang="ts">
  import {
    Button,
    Card,
    Headline,
    Accordion,
    AccordionSection,
    H2,
  } from "attractions";
  import { ChevronDownIcon } from "svelte-feather-icons";
  import { onMount } from "svelte";
  import InfoSummary from "./general/InfoSummary.svelte";
  import { formData } from "../stores/filterStore";
  import { Executor as ExecuteProcesses } from "../core";

  import {
    files,
    originalPageCounts,
    filteredPageCounts,
  } from "../stores/filesStore";

  let executor: ExecuteProcesses;

  onMount(async () => {
    console.log("formData", $formData);
    // this starts the process of filtering the files
    executor = new ExecuteProcesses($files, $formData);
    await executor.renderDocuments();
    filteredPageCounts.set(await executor.getPageCount());
  });

  const handleDownload = async () => {
    await executor.downloadAllDocuments();
  };
</script>

<div>
  <Headline>Summary</Headline>
  <InfoSummary
    bind:files={$files}
    bind:originalPageCount={$originalPageCounts}
    bind:newPageCount={$filteredPageCounts}
  />

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
        <div class="pdf-viewer" />
      </Card>
    </AccordionSection>
  </Accordion>

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
