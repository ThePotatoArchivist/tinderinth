<script lang="ts">
    import FilterControls from './FilterControls.svelte';
    import { compileFacets, type Facets } from './lib/modrinth/facets';
    import { TAGS } from './modrinth';
    
    let facets: Facets = []
</script>

<main>
    {#await TAGS}
        Loading...
    {:then tags} 
        <FilterControls {tags} bind:facets />
    {/await}
    
    {compileFacets(facets)}
</main>

<style>
</style>
