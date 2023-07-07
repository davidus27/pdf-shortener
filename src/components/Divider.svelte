<script lang="ts">
    export let selected: string;
</script>

<div class="strike">
    <span>
        <select class="select" bind:value={selected}>
            <option value="AND">AND</option>
            <option value="OR">OR</option>
        </select>
    </span>
</div>

<style>
    .select {
        border-radius: 36px;
        display: inline-block;
        overflow: hidden;
        margin-bottom: 0px;
    }

    .strike {
        /* add padding */
        padding-top: 1em;
        padding-bottom: 1em;

        display: block;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
    }

    .strike > span {
        position: relative;
        display: inline-block;
    }

    .strike > span:before,
    .strike > span:after {
        content: "";
        position: absolute;
        top: 50%;
        width: 9999px;
        height: 1px;
        background: rgba(0, 0, 0, 0.1);
    }

    .strike > span:before {
        right: 100%;
        margin-right: 15px;
    }

    .strike > span:after {
        left: 100%;
        margin-left: 15px;
    }
</style>
