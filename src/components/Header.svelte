<script lang="ts">
  import { Button, Breadcrumbs, Chip } from "attractions";
  import { HomeIcon, ArrowRightIcon, GithubIcon } from "svelte-feather-icons";

  export let items: { href: string; text: string }[];
</script>

<div class="navbar">
  <div class="breadcrumbs">
    <Breadcrumbs {items}>
      <div slot="item" let:item>
        {#if item.href === "/"}
          <Button href="/" round small>
            PDF Shortner&nbsp;
            <HomeIcon size="20" />
          </Button>
        {:else}
          <Chip>{item.text}</Chip>
        {/if}
      </div>
      <ArrowRightIcon slot="separator" size="20" />
    </Breadcrumbs>
  </div>

  <div class="github-button">
    <Button href="https://github.com/davidus27/pdf-shortener">
      <GithubIcon size="25" />
    </Button>
  </div>
</div>

<style>
  /*
    navbar will be alligned horizonarally at the same level
    breadcrumbs will be alligned to the left corner
    github button will be alligned to the right corner
    */
  .navbar {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
