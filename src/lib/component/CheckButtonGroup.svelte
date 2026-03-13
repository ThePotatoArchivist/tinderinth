<script lang="ts" generics="T">
    export let options: T[]
    export let value: NoInfer<T>[]
</script>

{#each options as option (option)}
    <label>
        <input type="checkbox" bind:group={value} value={option} />
        <slot {option}>
            {option}
        </slot>
    </label>
{/each}