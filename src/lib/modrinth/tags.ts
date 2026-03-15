import { type ModrinthV2Client } from '@xmcl/modrinth'
import { clientFetch } from './access'

export function getSideTypeTags(client: ModrinthV2Client, signal: AbortSignal | undefined = undefined) {
    return clientFetch<string[]>(client, signal, 'tag/side_type')
}

export function getProjectTypeTags(client: ModrinthV2Client, signal: AbortSignal | undefined = undefined) {
    return clientFetch<string[]>(client, signal, 'tag/project_type')
}