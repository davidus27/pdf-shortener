<script lang="ts">
  import { Button, Divider, H3, Label } from "attractions";
  import { ArrowUpCircleIcon } from "svelte-feather-icons";

  let showButton = false;

  // get if the user is at the bottom of the page
  const isAtBottom = (): boolean => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    return scrollTop + clientHeight >= scrollHeight;
  };

  // scroll to the top of the page
  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    showButton = false;
  };

  window.onscroll = (): void => {
    if (isAtBottom()) {
      showButton = true;
    }
  };
</script>

<footer class="footer">
  {#if showButton}
    <div class="scroll-top-btn">
      <Button filled on:click={scrollToTop}>
        <ArrowUpCircleIcon size="25" />&nbsp; scroll to the top
      </Button>
    </div>
  {/if}

  <Divider text="End of site" />
  <div>
    <Label small>This site was made with love ❤️</Label>
  </div>
</footer>

<style>
  /* set footer div to the responsive end of the page */
  .footer {
    min-height: 50px;
    margin-top: auto;
    /* make this ALWAYS be on the bottom of the physical screen */
    padding: 20px;
    text-align: center;
  }

  /* center scroll-top-btn to the center dynamically */
  .scroll-top-btn {
    float: center;
  }
</style>
