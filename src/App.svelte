<script lang="ts" >
	import { Button, FileDropzone, Card } from 'attractions';
	import { ArrowLeftIcon } from 'svelte-feather-icons';


	let files = [];
	let processing = false;

	const handleDocuments = async () => {
	}

	
</script> 

<main>

	{#if processing}
		<Button on:click={() => processing = false}>
			<ArrowLeftIcon size="25"/>
		</Button>
		<h1>test</h1>
	{:else}

		<h1>pdf shortener</h1>
		<p>If you want to shorten your document(s), please insert them down bellow</p>
		<FileDropzone bind:files accept=".pdf" max={20} />

		{#if files.length}
			<Button filled on:click={() => processing = true} >Submit</Button>
		{:else}
			<Button disabled filled >Submit</Button>
		{/if}
	{/if}

	<Button danger filled on:click={handleDocuments} >Process</Button>
	
	


</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>