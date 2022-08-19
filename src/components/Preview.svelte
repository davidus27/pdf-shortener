<script lang="ts">
  import { Button, Card, H1 } from "attractions";
  import ExecuteProcesses from '../executor';

  import { onMount } from 'svelte';

  export let files: Array<File>;
  export let formData: any;

  
  let executor = new ExecuteProcesses(files, formData);

  onMount(async () => {
    await executor.renderDocuments();
	});

  const handleDownload = async () => {
    await executor.downloadAllDocuments();
  }

</script>

<div>
  <H1>Preview</H1>

  <!-- <div id='pdf-viewer'></div> -->
  <Card id='pdf-viewer'>
    <div id='pdf-viewer'></div>
  </Card>

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
