<script lang="ts">
    import { Dialog } from "attractions";
    import { FileMinusIcon, FilePlusIcon } from "svelte-feather-icons";

    export let insertionText: string;

  </script>
  
  <div class="info">
    <Dialog
        danger={insertionText == "-"}
        constrainWidth
        title={insertionText == "+" ? "New PDF document was added." : "PDF document was removed."}
        closeCallback={() => insertionText="" }
    >
    <div slot="title-icon">
        {#if insertionText == "+"}
            <FilePlusIcon size="25" />
        {:else}
            <FileMinusIcon size="25" />
        {/if}
    </div>
  </Dialog>
</div>


<style>
    /* set the position to the left bottom of the page and make it slightly smaller */
    .info {
        position: fixed;
        bottom: 10%;
        left: 0;
        width: 100%;
        height: 100px;
        padding: 10px;
        z-index: 100;
    }

</style>  