<script lang="ts">
  import { Button, Card, Headline, Accordion, AccordionSection, H2, Subhead } from "attractions";
  import ExecuteProcesses from '../executor';
  import { ChevronDownIcon } from "svelte-feather-icons";
  import { onMount } from 'svelte';
  import InfoSummary from "./InfoSummary.svelte";


  export let files: Array<File>;
  export let formData: any;
  
  let originalPageCount = 25;
  let newPageCount = 5;

  
  let executor = new ExecuteProcesses(files, formData);

  onMount(async () => {
    await executor.renderDocuments();
	});

  const handleDownload = async () => {
    await executor.downloadAllDocuments();
  }

</script>

<div>
  <Headline>Summary</Headline>
  <InfoSummary bind:files bind:originalPageCount bind:newPageCount/>  

  <Accordion let:closeOtherPanels>
    <AccordionSection on:panel-open={closeOtherPanels}>
        <div slot="handle" let:toggle>
            <Button on:click={toggle}>
                <H2>Preview pages</H2>&nbsp;
                <ChevronDownIcon size="25" class="ml accordion-chevron" />
            </Button>
        </div>
        <Card id='pdf-viewer'>
          <div id='pdf-viewer'></div>
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
    float:right;
    /* add some padding */
    padding: 20px;
  }

</style>
