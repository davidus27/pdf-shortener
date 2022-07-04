<script lang="ts" >
    import { SnackbarContainer, FileDropzone } from 'attractions';

    export let files = [];

    const handleChange = (e: CustomEvent, showSnackbar: (arg: any) => void) => {
            const nativeEvent = e.detail?.nativeEvent;
            console.log('files', files);
            if (!nativeEvent) {
                // file was removed
                showSnackbar({
                    props: { text: 'File removed!' },
                    component: undefined,
                    duration: 1500
                });
                return;
            }
            // file was added
            showSnackbar({
                props: { text: 'File added!' },
                component: undefined,
                duration: 1500
            })
    };

</script>

<div>
    <h1>pdf shortener</h1>
    <p>If you want to shorten your document(s), please insert them down bellow</p>
    <SnackbarContainer let:showSnackbar >
        <FileDropzone bind:files accept=".pdf" max={20} on:change={(e) => handleChange(e, showSnackbar)} />
    </SnackbarContainer>
</div>

<style>
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
</style>