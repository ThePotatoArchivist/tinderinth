import type { Category, GameVersion, Loader } from "@xmcl/modrinth"
import { SvelteMap } from "svelte/reactivity"
import type { State } from "../component/FilterButton.svelte"
import { facet, type Facets } from "./facets"

export const MAIN_MOD_LOADERS = [ 'fabric', 'forge', 'neoforge' ]

export const SIDED_PROJECT_TYPES = [ 'mod', 'modpack' ]

export interface Filters {
    categoryFilters: SvelteMap<Category, State>
    selectedLoaders: Loader[]
    serverSide: boolean
    clientSide: boolean
    selectedVersions: GameVersion[]
}

export function emptyFilters(): Filters {
    return {
        categoryFilters: new SvelteMap(),
        selectedLoaders: [],
        serverSide: false,
        clientSide: false,
        selectedVersions: []
    }
}

export function isRelevantCategory(projectType: string) {
    return (category: Category) => category.project_type === projectType || category.project_type === 'mod' && (projectType === 'plugin' || projectType === 'datapack')
}

export function isRelevantLoader(projectType: string, allLoaders: boolean) {
    return (loader: Loader) => loader.supported_project_types.includes(projectType) 
        && (allLoaders || projectType !== 'mod' || MAIN_MOD_LOADERS.includes(loader.name))
        && (!loader.supported_project_types.includes('plugin') && !loader.supported_project_types.includes('datapack') || projectType !== 'mod')

}

export function compileFilters(projectType: string, {categoryFilters, selectedLoaders, serverSide, clientSide, selectedVersions}: Filters): Facets {
    return [
        [facet('project_type', projectType)],
        ...categoryFilters.entries().filter(([_, state]) => state).map(([category]) => [facet('categories', category)]),
        ...categoryFilters.entries().filter(([_, state]) => state === false).map(([category]) => [facet('categories', category, '!=')]),
        selectedLoaders.map(loader => facet('categories', loader)),
        selectedVersions.map(version => facet('versions', version)),
        clientSide 
            ? serverSide
                ? [facet('client_side', 'required')] 
                : [facet('client_side', 'unsupported', '!=')] 
            : serverSide 
                ? [facet('client_side', 'required', '!=')] 
                : [],
        serverSide 
            ? clientSide
                ? [facet('server_side', 'required')] 
                : [facet('server_side', 'unsupported', '!=')] 
            : clientSide 
                ? [facet('server_side', 'required', '!=')] 
                : [],
    ].filter(e => e.length > 0)
}