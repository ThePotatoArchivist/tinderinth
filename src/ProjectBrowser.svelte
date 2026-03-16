<script lang="ts">
    import type { SearchResultHit } from '@xmcl/modrinth';
    import FilterControls from './FilterControls.svelte';
    import { type Facets } from './lib/modrinth/facets';
    import { getProjectCount, getRandomProject, type TagTypes } from './modrinth';
    import ProjectCard, { preload } from './ProjectCard.svelte';
    import Swipable from './lib/component/Swipable.svelte';
    import { CloseIcon, FavoriteIcon, FilterIcon } from './icons';
    import { prequeue } from './lib/util/prequeue';
    import { createEventDispatcher } from 'svelte';
    import PopupButton from './lib/component/PopupButton.svelte';
    import { compileFilters, emptyFilters } from './lib/modrinth/filters';
    import { NEVER_RESOLVED } from './lib/util/misc';
        
    export let projectType: string
    export let tags: TagTypes
    
    export let filters = emptyFilters()
    
    let projectQueue: AsyncIterator<SearchResultHit> | undefined
    let projectP: Promise<SearchResultHit> = NEVER_RESOLVED

    let filtersOpen = true
    let swipable: Swipable | undefined
    
    const dispatch = createEventDispatcher<{
        save: SearchResultHit
    }>()
    
    $: if (filters) projectQueue = undefined
    
    $: if (!filtersOpen && projectQueue === undefined && projectP === NEVER_RESOLVED) showNext()
            
    function showNext() {
        if (projectQueue === undefined) {
            projectP = NEVER_RESOLVED
            const facets = compileFilters(projectType, filters)
            getProjectCount(facets)
                .then(count => {
                    setupQueue(facets!, count)
                    shiftQueue()
                })
        } else
            shiftQueue()
    }
    
    function shiftQueue() {
        projectP = projectQueue?.next().then(({value}) => value) ?? NEVER_RESOLVED
    }
    
    function setupQueue(facets: Facets, count: number) {
        projectQueue = prequeue(3, () => getRandomProject(facets, count).then(preload))
    }

</script>

<svelte:window on:keydown={event => {
    if (swipable === undefined) return
    switch (event.key) {
        case 'ArrowLeft':
            swipable.swipeLeft()
            break
        case 'ArrowRight':
            swipable.swipeRight()
            break
        default:
            return
    }
    event.preventDefault()
}} />

<div class="container">
    <div class="card-container">
        {#key projectP}
            {#await projectP}
                <div>Loading...</div>
            {:then project} 
                <Swipable
                    bind:this={swipable}
                    onSwipeLeft={() => {
                        showNext()
                    }}
                    onSwipeRight={() => {
                        dispatch('save', project)
                        showNext()
                    }}
                >
                    <ProjectCard {project} gameVersions={tags.versions} />
                </Swipable>
            {/await}
        {/key}
    </div>

    <div class="buttons">
        <button on:click={() => swipable?.swipeLeft()} aria-label="dismiss">
            <CloseIcon />
        </button>
        <button on:click={() => swipable?.swipeRight()} aria-label="save">
            <FavoriteIcon />
        </button>
    </div>
    <div class="buttons">
        <slot name="buttons-left" />

        <PopupButton bind:open={filtersOpen} aria-label="Filters">
            <FilterIcon slot="button" />

            <FilterControls {tags} bind:filters {projectType} />
        </PopupButton>

        <slot name="buttons-right" />
    </div>
</div>

<style>
    .container {
        height: 100%;
        max-width: 40rem;
        margin: auto;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
    }

    .card-container {
        width: 100%;
        position: relative;
        flex-grow: 1;
        display: grid;
        place-items: center;
    }
    
    .buttons {
        display: flex;
        gap: 1rem;
    }
    
    .buttons :global(button) {
        flex-basis: 0;
        flex-grow: 1;
    }
</style>
