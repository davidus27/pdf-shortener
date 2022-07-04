<script lang="ts" >
	import { Button, Tabs } from 'attractions';
	// import { } from 'svelte-feather-icons';
	
	import Filter from './components/Filter.svelte';
	import Footer from './components/Footer.svelte';
	import Header from './components/Header.svelte';
	import Processing from './components/Processing.svelte';
	import Starter from './components/Starter.svelte';
	import Warning from './components/Warning.svelte';



	let files = [];
	let processing = false;
	let selectedTab = 'Main dishes';

	
</script>


<main>


	<Header />

	{#if !processing}
		<Starter on:files />
		
		<Button disabled={Boolean(files.length)} filled on:click={() => processing = true} >Submit</Button>
		<Button on:click={() => console.log(files)} >Debug</Button>
	{:else}

		<Processing bind:files bind:processing />

	
		<!-- <Button outline>
			<div id="pdf-viewer" />
		</Button>
		<Warning /> -->

	{/if}	

	<Footer />

</main>


<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>