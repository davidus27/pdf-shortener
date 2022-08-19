<script lang="ts">
  import { Button } from "attractions";
  import { PdfViewer, DocumentFilters } from "../pdf";
  import Filter from "./Filter.svelte";


  export let moveNext: any
  export let files: Array<File>;
  let formData: DocumentFilters;

  const handleDocuments = async () => {
    console.log("handleDocuments: ", formData);
    moveNext({
      "formData": formData,
    });
  };

  let pageCount: number;
  // get pages count from pdf
  const getPageCounts = async () => {
    const pdfViewerObj = new PdfViewer(files);
    await pdfViewerObj.prepareForRender();
    return pdfViewerObj.getPageCounts();
  };

  getPageCounts().then((counts) => {
    pageCount = counts[0];
  });

</script>

<div>
  <Filter bind:formData bind:pageCount />

  <div class="process-btn">
    <Button danger filled on:click={handleDocuments}>Process</Button>
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
