<script lang="ts">
  import { fade } from "svelte/transition";
  import { Button } from "attractions";
  import { ArrowLeftIcon, XIcon } from "svelte-feather-icons";

  import Footer from "./components/Footer.svelte";
  import Header from "./components/Header.svelte";
  import Processing from "./components/Processing.svelte";
  import Starter from "./components/Starter.svelte";
  import Review from "./components/Review.svelte";

  let files = [];
  let breadcrumbsPath = [{ href: "/", text: "Home" }];

  const views = [Starter, Processing, Review];
  // const views = [Starter, Review];


  const path = [
    { href: "/", text: "Home" },
    { href: "/checkout", text: "Checkout" },
    { href: "/review", text: "Review" },
  ];

  let currentView = 0;
  let viewComponent = views[currentView];

  const updateView = (newProps: Object) => {
    viewComponent = views[currentView];
    // set addtional props to the view component
    if (newProps) {
      props = { ...props, ...newProps };
    }
    breadcrumbsPath = path.slice(0, currentView + 1);
  };

  const moveNext = (newProps = null) => {
    // check if we are at the last view
    if (currentView === views.length - 1) {
      return;
    }
    currentView++;
    updateView(newProps);
  };

  const movePrevious = (newProps = null) => {
    // check if we are at the first view
    if (currentView === 0) {
      return;
    }
    currentView--;
    updateView(newProps);
  };

  const reset = () => {
    currentView = 0;
    updateView(null);
  };



  const saveAlert = (e: any) => {
    if (files.length == 0) {
      return;
    }
    if(!e) e = window.event;
    //e.cancelBubble is supported by IE - this will kill the bubbling process.
    e.cancelBubble = true;
    //This is displayed on the dialog box.
    e.returnValue = 'Are you sure you want to leave? All the progress will be removed'; 
    //e.stopPropagation works in Firefox.
    if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
    }
  }
  // window.onbeforeunload = saveAlert; 
  window.onbeforeprint = undefined;

  let props = {
    files,
    moveNext,
  };

</script>

<main>
  <Header bind:items={breadcrumbsPath} />

  <div id="viewport" on:outroend={updateView} transition:fade>
    {#if currentView > 0}
      <div class="buttons">
        <Button on:click={movePrevious} round small>
          <ArrowLeftIcon size="20" />
        </Button>
        <Button on:click={reset} round small>
          <XIcon size="20" />
        </Button>
      </div>
    {/if}
    <svelte:component this={viewComponent} {...props} />
  </div>

  <!-- <Footer /> -->
</main>


<style>

  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  /* set viewport to the flexbox */
  #viewport {
    height:100vh; 
    margin:0;
    min-height:50px;
    display:flex; 
    flex-direction:column;
  }

  /* make buttons horizontally alligned */
  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1em;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
