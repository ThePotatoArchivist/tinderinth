<script lang="ts">

    export let open = false
    
    let dialog: HTMLDialogElement
    
    $: {
        if (dialog !== undefined) {
            if (open) {
                if (!dialog.open)
                    dialog.showModal()
            } else {
                if (dialog.open)
                    dialog.close()
            }
        }
    }
</script>

<button on:click={() => open = true} command="show-modal" {...$$restProps}>
    <slot name="button" />
</button>

<dialog bind:this={dialog} closedby='any' on:close={() => open = false}>
    <slot />
</dialog>