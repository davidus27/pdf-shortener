<script lang="ts">
    import { Button, Breadcrumbs, Chip } from 'attractions';
	  import { HomeIcon, ArrowRightIcon, XIcon, ArrowLeftIcon } from 'svelte-feather-icons';

    import { prepareDocumentProxy, renderPages, processAllDocuments } from '../pdf';
import Filter from './Filter.svelte';


    export let files : Array<File>;
    export let processing : boolean;

    const handleDocuments = async () => {
      const pdfDocuments = await prepareDocumentProxy(files);
      const indexes = await processAllDocuments(files);

      // console.log(pdfDocuments);
      renderPages(document, pdfDocuments[0], indexes);

	}


</script>

<div>

    <!-- Back button  -->
    <Button on:click={() => {processing = false}}>
        <ArrowLeftIcon size="25"/>
    </Button>

    <Filter />

    <Button danger filled on:click={handleDocuments} >Process</Button>

</div>