<script lang="ts">
    import { Button, Dialog } from "attractions";
    import { AlertTriangleIcon } from "svelte-feather-icons";
</script>

<Dialog
    title="Are you sure you want to exit?"
    closeCallback={() => console.log("Closing the dialog...")}
    danger
>
    <div slot="title-icon">
        <AlertTriangleIcon size="25" />
    </div>
    <p>You have not saved your changes yet.</p>
    <p>If you exit without saving, changes will be lost.</p>
    <p>Are you sure you want to exit?</p>
    <Button>yes, exit</Button>
</Dialog>
