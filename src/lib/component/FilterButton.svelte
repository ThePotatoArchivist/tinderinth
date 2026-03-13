<script lang="ts" context="module">
    export type State = true | false | undefined
</script>

<script lang="ts">
    export let state: State = undefined
</script>

<div class="button" class:include={state} class:exclude={state === false}>
    <button on:click={() => state = state ? undefined : true}>
        <slot />
    </button>
    <button on:click={() => state = state === false ? undefined : false}>
        X
    </button>
</div>

<style>

.button {
    display: inline-block;
}

.include {
    background-color: lime;
}

.exclude {
    background-color: red;
}

</style>