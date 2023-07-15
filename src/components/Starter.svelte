<script lang="ts">
  import {
    SnackbarContainer,
    FileDropzone,
    Button,
    Subhead,
  } from "attractions";
  import { SnackbarPositions } from "attractions/snackbar";
  import Info from "./general/Info.svelte";
  import { files } from "../stores/filesStore";

  // export let files = [];
  export let moveNext: () => void;
  let insertionText: string;

  const handleChange = (e: CustomEvent, showSnackbar: (arg: any) => void) => {
    const nativeEvent = e.detail?.nativeEvent;
    if (!nativeEvent) {
      // file was removed
      // showSnackbar({
      //   props: { text: "File removed!" },
      //   component: undefined,
      //   duration: 1500,
      // });
      setIsInsertion("-");
      return;
    }
    // file was added
    // showSnackbar({
    //   props: { text: "File added!" },
    //   component: undefined,
    //   duration: 1500,
    // });
    setIsInsertion("+");
  };

  const setIsInsertion = (warn: string) => {
    // Not ideal solution but it mostly works
    insertionText = warn;
    const tmpValue = insertionText;
    setTimeout(
      () => {
        if (tmpValue === insertionText) {
          insertionText = "";
        }
      },
      2500,
      tmpValue
    );
  };

  const handleSubmit = () => {
    // update store

    // move to the next page
    moveNext();
  }

</script>

<div class="starter">
  <h1>pdf shortener</h1>
  <Subhead
    >If you want to shorten your document(s), please insert them down bellow</Subhead
  >
  <SnackbarContainer let:showSnackbar position={SnackbarPositions.BOTTOM_RIGHT}>
    <FileDropzone
      aria-label="Drop files here"
      bind:files={$files}
      accept=".pdf"
      max={20}
      on:change={(e) => handleChange(e, showSnackbar)}
    />
  </SnackbarContainer>

  <div class="submit-btn">
    <Button
      disabled={!$files.length}
      filled
      on:click={handleSubmit}>Submit</Button
    >
  </div>

  {#if insertionText}
    <Info bind:insertionText />
  {/if}
</div>

<style>
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 5.9vw;
    font-weight: 100;
  }

  /* 
  move starter slighltly closer to the vertical center
  add it side padding
  */
  /* .starter {
    margin-top: 7em;
    position: relative;
    top: -50px;
    padding: 20px;
  } */

  /* move submit-btn to the relative right side of the screen */
  .submit-btn {
    float: right;
    /* add some padding */
    padding: 20px;
  }
</style>
