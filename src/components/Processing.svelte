<script lang="ts">
  import { Button } from "attractions";
  import { PdfViewer } from "../pdf";
  import Filter from "./Filter.svelte";


  export let moveNext = () => {};
  export let files: Array<File>;
  export let formData: any;

  let indexes: Array<number> = [0, 1, 2, 3];

  const handleDocuments = async () => {
    moveNext();
  };

  let pageCount: number = 0;
  // get pages count from pdf
  const getPageCount = async () => {
    const pdfViewerObj = new PdfViewer(files, formData);

    await pdfViewerObj.process();
    return pdfViewerObj.getPageCount();
  };

  getPageCount().then((count) => {
    pageCount = count;
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
