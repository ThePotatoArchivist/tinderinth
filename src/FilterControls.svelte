<script lang="ts">
    import type { Facets, TAGS } from './modrinth';

    export let value: Facets = []
    export let tags: Awaited<typeof TAGS>
</script>

{JSON.stringify(tags.categories)}

