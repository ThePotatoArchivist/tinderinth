<script lang="ts">
    import type { TagTypes } from './modrinth';
    import { compileFacets } from './lib/modrinth/facets';
    import type { Category } from '@xmcl/modrinth';
    import FilterButtonGroup from './lib/component/FilterButtonGroup.svelte';
    import { groupby } from './lib/util/misc';
    import CheckButtonGroup from './lib/component/CheckButtonGroup.svelte';
    import { text } from './text';
    import { compileFilters, emptyFilters, isRelevantCategory, isRelevantLoader, SIDED_PROJECT_TYPES } from './lib/modrinth/filters';

    export let tags: TagTypes
    const { categories, loaders, versions } = tags
    export let projectType: string
    
    export let filters = emptyFilters()

    let allLoaders = false
    let allVersions = false
    
    $: relevantCategories = categories.filter(isRelevantCategory(projectType))
    $: relevantLoaders = loaders.filter(isRelevantLoader(projectType, allLoaders))
    $: relevantVersions = allVersions ? versions : versions.filter(e => e.version_type === 'release')
    
    $: categoryHeaders = groupby(relevantCategories, category => category.header)
</script>

<div>
    {#each categoryHeaders.keys() as header (header)}
        {@const categories = categoryHeaders.get(header)!}
        <h3>{text(header)}</h3>
        <FilterButtonGroup bind:states={filters.categoryFilters} options={categories} let:option>
            {@const tOption = option as Category}
            {#if tOption.icon}
                <div class="fit-icon">
                    {@html tOption.icon}
                </div>
            {/if}
            {text(tOption.name)}
        </FilterButtonGroup>
    {/each}
</div>

{#if relevantLoaders.length > 1}
    <div>
        <label>
            <input type="checkbox" bind:checked={allLoaders} />
            Show all loaders
        </label>
        
        <CheckButtonGroup options={relevantLoaders} bind:value={filters.selectedLoaders} let:option>
            <div class="fit-icon">
                {@html option.icon}
            </div>
            {text(option.name)}
        </CheckButtonGroup>
    </div>
{/if}

{#if SIDED_PROJECT_TYPES.includes(projectType)}
    <div>
        <label>
            <input type="checkbox" bind:checked={filters.clientSide} />
            Client
        </label>
        <label>
            <input type="checkbox" bind:checked={filters.serverSide} />
            Server
        </label>
    </div>
{/if}

<div>
    <label>
        <input type="checkbox" bind:checked={allVersions} />
        Show all versions
    </label>
    
    <select multiple bind:value={filters.selectedVersions}>
        {#each relevantVersions as version (version)}
            <option value={version}>{version.version}</option>
        {/each}
    </select>
</div>

<div>{compileFacets(compileFilters(projectType, filters))}</div>

<style>
    .fit-icon {
        display: inline-block;
        width: 1em;
        height: 1em;
    }
</style>