export function firstOrOnly(
    collection: string | string[] | undefined
): string | undefined {
    if (typeof collection === 'string') {
        return collection;
    }

    if (!!collection) {
        return collection[0];
    }

    return undefined;
}
