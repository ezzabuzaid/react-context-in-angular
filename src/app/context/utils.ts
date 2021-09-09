export function assertStringIsNotEmpty(debugLabel: string, value: any): asserts value is string {
    if (typeof value !== 'string') {
        throw new Error(`${ debugLabel } is not string`);
    }
    if (value.trim() === '') {
        throw new Error(`${ debugLabel } cannot be empty`);
    }
}
