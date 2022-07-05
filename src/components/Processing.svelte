<script lang="ts">
  import { Button } from "attractions";
  import { ArrowLeftIcon } from "svelte-feather-icons";

  import {
    prepareDocumentProxy,
    renderPages,
    processAllDocuments,
  } from "../pdf";
  import Filter from "./Filter.svelte";

  export let moveNext = () => {};
  export let files: Array<File>;

  const handleDocuments = async () => {
    const pdfDocuments = await prepareDocumentProxy(files);
    const indexes = await processAllDocuments(files);

    console.log(indexes);
    // renderPages(document, pdfDocuments[0], indexes);

    moveNext();
  };
</script>

<div>
  <Filter />

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
