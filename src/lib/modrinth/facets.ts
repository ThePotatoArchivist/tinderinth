import type { Category, Loader, GameVersion } from '@xmcl/modrinth';

type SideType = 'required' | 'optional' | 'unsupported'

export interface FacetTypes {
    project_type: string;
    categories: Category | Loader;
    versions: GameVersion;
    client_side: SideType;
    server_side: SideType;
}

export interface Facet<T extends keyof FacetTypes> {
    type: T;
    value: FacetTypes[T];
    operation: ':' | '=' | '!=' | '>=' | '>' | '<=' | '<';
}

export function facet<T extends keyof FacetTypes>(type: T, value: FacetTypes[T], operation: Facet<T>['operation'] = ':'): Facet<T> {
    return { type, value, operation };
}

export type Facets = Facet<keyof FacetTypes>[][];
function getFacetValue(value: FacetTypes[keyof FacetTypes]): string {
    if (typeof value !== 'object') return value.toString();
    if ('name' in value) return value.name;
    if ('version' in value) return value.version;
    return value;
}

export function compileFacets(facets: Facets): string {
    return `[${facets.map(a => `[${a.map(({ type, value, operation = ':' }) => `"${type}${operation}${getFacetValue(value)}"`
    ).join(',')}]`
    ).join(',')}]`;
}
