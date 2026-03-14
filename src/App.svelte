<script lang="ts">
    import type { SearchResultHit } from '@xmcl/modrinth';
    import FilterControls from './FilterControls.svelte';
    import { type Facets } from './lib/modrinth/facets';
    import { getProjectCount, getRandomProject, TAGS } from './modrinth';
    
    let facets: Facets | undefined
    let projectType: string | undefined
    
    let rolling = false
    let project: SearchResultHit | undefined
    
    $: count = facets === undefined ? Promise.resolve(0) : getProjectCount(facets)
    
    async function roll(count: number) {
        if (facets === undefined || rolling) return
        rolling = true
        project = await getRandomProject(facets, count)
        rolling = false
    }

</script>

<main>
    {#await TAGS}
        Loading...
    {:then tags} 
        {#if projectType === undefined}
            {#each tags.projectTypes as type (type)}
                <button on:click={() => projectType = type}>{type}</button>
            {/each}
        {:else}
            <button on:click={() => projectType = undefined}>All Project Types</button>
            <details>
                <summary>Filters</summary>
                <FilterControls {tags} bind:facets {projectType} />
            </details>

            <div>
                <button on:click={() => count.then(roll)}>Next</button>
                {#if project !== undefined}
                    {#if project.featured_gallery !== null}
                        <img src={project.featured_gallery} alt="{project.title} gallery image" />
                    {/if}
                    <img src={project.icon_url} alt="{project.title} icon" />
                    <a href="https://modrinth.com/project/{project.project_id}">{project.title}</a>
                {/if}
            </div>
        {/if}
    {/await}
</main>

<style>
</style>
