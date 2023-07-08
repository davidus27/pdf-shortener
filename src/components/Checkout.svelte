<script lang="ts">
  import { Button } from "attractions";
  import { PdfViewer } from "../core";
  import Filter from "./Filter.svelte";
  import { onMount } from "svelte";
  import { files, originalPageCounts } from "../stores/filesStore";

  export let moveNext: any;

  onMount(async () => {
    const pdfViewerObj = new PdfViewer($files);
    await pdfViewerObj.prepareForRender();

    originalPageCounts.update((): number[] => {
      return pdfViewerObj.getPageCounts();
    });

  });
</script>

<div>
  <Filter />

  <div class="process-btn">
    <Button danger filled on:click={moveNext}>Process</Button>
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
