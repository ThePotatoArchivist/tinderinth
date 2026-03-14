<script lang="ts" generics="T">
    export let options: T[]
    export let value: NoInfer<T> | undefined = undefined
</script>

{#each options as option (option)}
    <label>
        <input type="radio" bind:group={value} value={option} />
        <slot {option}>
            {option}
        </slot>
    </label>
{/each}