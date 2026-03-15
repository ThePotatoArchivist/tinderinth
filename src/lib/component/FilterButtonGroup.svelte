<script lang="ts" generics="T">
    import type { SvelteMap } from 'svelte/reactivity';
    import FilterButton, { type State } from './FilterButton.svelte';

    export let values: SvelteMap<T, State>
    export let include: (value: T) => boolean = () => true
</script>

{#each values.keys().filter(include) as option (option)}
    <FilterButton bind:state={
        () => values.get(option),
        value => values = values.set(option, value)
    }>
        <slot {option}>
            {option}
        </slot>
    </FilterButton>
{/each}
