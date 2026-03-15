import { type ModrinthV2Client, ModerinthApiError } from '@xmcl/modrinth';

export function access(client: ModrinthV2Client) {
    return client as unknown as {
        baseUrl: string;
        fetch: ModrinthV2Client['fetch'];
    };
}

export async function clientFetch<T>(client: ModrinthV2Client, signal: AbortSignal | undefined, path: string): Promise<T> {
    const clientAccess = access(client);
    const url = new URL(clientAccess.baseUrl + '/v2/' + path);
    const response = await clientAccess.fetch(url, {
        headers: client.headers,
        signal,
    });
    if (response.status !== 200) {
        throw new ModerinthApiError(url.toString(), response.status, await response.text());
    }
    const result = await response.json() as T;
    return result;
}
