import type { Category } from "@xmcl/modrinth";
import { SvelteMap } from "svelte/reactivity";
import type { TagTypes } from "../../modrinth";
import { transformKey, keyIs, transformValue } from "../util/misc";
import type { Filters } from "./filters";

export interface SerializedFilters {
    categoryFilters: Record<string, boolean>;
    selectedLoaders: string[];
    serverSide: boolean;
    clientSide: boolean;
    selectedVersions: string[];
}

export function serializeFilters({ categoryFilters, selectedLoaders, clientSide, serverSide, selectedVersions }: Filters): SerializedFilters {
    return {
        categoryFilters: categoryFilters.entries().reduce((prev, [key, value]) => {
            if (value !== undefined)
                prev[key.name] = value;
            return prev;
        }, {} as Record<string, boolean>),
        selectedLoaders: selectedLoaders.map(e => e.name),
        serverSide,
        clientSide,
        selectedVersions: selectedVersions.map(e => e.version)
    };
}

export function deserializeFilters(projectType: string, tags: TagTypes, { categoryFilters, selectedLoaders, clientSide, serverSide, selectedVersions }: SerializedFilters): Filters {
    const categories = tags.categoriesByNameByType.get(projectType) ?? new Map<string, Category>();

    return {
        categoryFilters: new SvelteMap(Object.entries(categoryFilters)
            .map(transformKey(category => categories.get(category)))
            .filter(keyIs(k => k !== undefined))
        ),
        selectedLoaders: selectedLoaders
            .map(loader => tags.loadersByName.get(loader))
            .filter(e => e !== undefined),
        serverSide,
        clientSide,
        selectedVersions: selectedVersions
            .map(version => tags.versionsByName.get(version))
            .filter(e => e !== undefined)
    };
}

export type FilterSet = Record<string, Filters>;
export type SerializedFilterSet = Record<string, SerializedFilters>;

export function serializeFilterSet(filterSet: FilterSet): SerializedFilterSet {
    return Object.fromEntries(Object.entries(filterSet)
        .map(transformValue(serializeFilters))
    );
}

export function deserializeFilterSet(tags: TagTypes) {
    return (filterSet: SerializedFilterSet): FilterSet => Object.fromEntries(Object.entries(filterSet)
        .map(([projectType, filters]) => [projectType, deserializeFilters(projectType, tags, filters)])
    );
}
