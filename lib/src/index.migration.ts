export const one = 1
export const two = 2


class Laminate {
    private readonly initialTheme: string;
    private readonly useCache: boolean;
    private readonly cacheName: string;

    constructor(useCache: boolean, cacheName = 'theme', initialTheme = 'default') {
        this.useCache = useCache;
        this.cacheName = cacheName;
        this.initialTheme = initialTheme;
    }
}
