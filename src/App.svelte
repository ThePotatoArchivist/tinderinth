<script lang="ts">
    import FilterControls from './FilterControls.svelte';
    import { TAGS } from './modrinth';
    
</script>

<main>
    {#await TAGS}
        Loading...
    {:then tags} 
        <FilterControls {tags} />
    {/await}
    
</main>

<style>
</style>
