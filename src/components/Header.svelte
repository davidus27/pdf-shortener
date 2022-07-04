<script lang="ts">
    import { Button, Breadcrumbs, Chip } from 'attractions';
	import { HomeIcon, ArrowRightIcon } from 'svelte-feather-icons';

    const items = [{ href: '/', text: 'Home' }];

    
</script>

<div>
    <Breadcrumbs {items}>
        <div slot="item" let:item>
          {#if item.href === '/'}
            <Button href="/" round small>
              <HomeIcon size="20" />
            </Button>
          {:else}
            <Chip>{item.text}</Chip>
          {/if}
        </div>
        <ArrowRightIcon slot="separator" size="20" />
      </Breadcrumbs>
</div>