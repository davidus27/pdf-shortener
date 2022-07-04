<script lang="ts">
    import { Button, Dialog, Divider } from 'attractions';
	import { AlertTriangleIcon, ArrowUpCircleIcon } from 'svelte-feather-icons';



    let showButton = false;

    // get if the user is at the bottom of the page
    const isAtBottom = (): boolean => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        return scrollTop + clientHeight >= scrollHeight;
    };

    // scroll to the top of the page
    const scrollToTop = (): void => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        showButton = false;
    };


    window.onscroll = (): void => {
        if (isAtBottom()) {
            showButton = true;
        }
    };

</script>

<div>
    {#if showButton}
        <Button filled on:click={scrollToTop}>
            <ArrowUpCircleIcon size="25" />&nbsp;
            scroll to the top
        </Button>
    {/if}

    <Divider text="End of site" />
    <div>
        <h5>This site was made with love ❤️</h5>
    </div>
   
</div>