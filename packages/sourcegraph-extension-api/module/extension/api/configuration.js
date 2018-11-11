import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
/**
 * @internal
 * @template C - The configuration schema.
 */
class ExtConfigurationSection {
    constructor(proxy, data) {
        this.proxy = proxy;
        this.data = data;
    }
    get(key) {
        return this.data[key];
    }
    async update(key, value) {
        // Cast `key` to `string | number` (i.e., eliminate `symbol`). We could use `Extract<keyof
        // C, string | number` in the sourcegraph.d.ts type signature, but that would add useless
        // complexity.
        await this.proxy.$acceptConfigurationUpdate({ path: [key], value });
    }
    get value() {
        return this.data;
    }
    toJSON() {
        return this.data;
    }
}
/**
 * @internal
 * @template C - The configuration schema.
 */
export class ExtConfiguration {
    constructor(proxy) {
        this.proxy = proxy;
        this.data = new BehaviorSubject(null);
    }
    $acceptConfigurationData(data) {
        this.data.next(Object.freeze(data));
        return Promise.resolve();
    }
    get() {
        const data = this.data.value;
        if (data === null) {
            throw new Error('Configuration is not yet available. `sourcegraph.configuration.get` is not usable until after the extension `activate` function is finished executing. This is a known issue and will be fixed before the beta release of Sourcegraph extensions. In the meantime, work around this limitation by deferring calls to `get`.');
        }
        return Object.freeze(new ExtConfigurationSection(this.proxy, data.merged));
    }
    subscribe(next) {
        // Do not emit until the configuration is available.
        return this.data.pipe(filter(data => data !== null)).subscribe(next);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJzcmMvIiwic291cmNlcyI6WyJleHRlbnNpb24vYXBpL2NvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQTtBQUN0QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFLdkM7OztHQUdHO0FBQ0gsTUFBTSx1QkFBdUI7SUFDekIsWUFBb0IsS0FBNkIsRUFBVSxJQUFPO1FBQTlDLFVBQUssR0FBTCxLQUFLLENBQXdCO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBRztJQUFHLENBQUM7SUFFL0QsR0FBRyxDQUFvQixHQUFNO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUN6QixDQUFDO0lBRU0sS0FBSyxDQUFDLE1BQU0sQ0FBb0IsR0FBTSxFQUFFLEtBQXVCO1FBQ2xFLDBGQUEwRjtRQUMxRix5RkFBeUY7UUFDekYsY0FBYztRQUNkLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEdBQXNCLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQzFGLENBQUM7SUFFRCxJQUFXLEtBQUs7UUFDWixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUE7SUFDcEIsQ0FBQztJQUVNLE1BQU07UUFDVCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUE7SUFDcEIsQ0FBQztDQUNKO0FBVUQ7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLGdCQUFnQjtJQUd6QixZQUFvQixLQUE2QjtRQUE3QixVQUFLLEdBQUwsS0FBSyxDQUF3QjtRQUZ6QyxTQUFJLEdBQUcsSUFBSSxlQUFlLENBQXFCLElBQUksQ0FBQyxDQUFBO0lBRVIsQ0FBQztJQUU5Qyx3QkFBd0IsQ0FBQyxJQUFpQjtRQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7UUFDbkMsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDNUIsQ0FBQztJQUVNLEdBQUc7UUFDTixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQTtRQUM1QixJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUNYLDZUQUE2VCxDQUNoVSxDQUFBO1NBQ0o7UUFDRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSx1QkFBdUIsQ0FBSSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBQ2pGLENBQUM7SUFFTSxTQUFTLENBQUMsSUFBZ0I7UUFDN0Isb0RBQW9EO1FBQ3BELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3hFLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnXG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycydcbmltcG9ydCAqIGFzIHNvdXJjZWdyYXBoIGZyb20gJ3NvdXJjZWdyYXBoJ1xuaW1wb3J0IHsgQ2xpZW50Q29uZmlndXJhdGlvbkFQSSB9IGZyb20gJy4uLy4uL2NsaWVudC9hcGkvY29uZmlndXJhdGlvbidcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25DYXNjYWRlIH0gZnJvbSAnLi4vLi4vcHJvdG9jb2wnXG5cbi8qKlxuICogQGludGVybmFsXG4gKiBAdGVtcGxhdGUgQyAtIFRoZSBjb25maWd1cmF0aW9uIHNjaGVtYS5cbiAqL1xuY2xhc3MgRXh0Q29uZmlndXJhdGlvblNlY3Rpb248QyBleHRlbmRzIG9iamVjdD4gaW1wbGVtZW50cyBzb3VyY2VncmFwaC5Db25maWd1cmF0aW9uPEM+IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByb3h5OiBDbGllbnRDb25maWd1cmF0aW9uQVBJLCBwcml2YXRlIGRhdGE6IEMpIHt9XG5cbiAgICBwdWJsaWMgZ2V0PEsgZXh0ZW5kcyBrZXlvZiBDPihrZXk6IEspOiBDW0tdIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVtrZXldXG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHVwZGF0ZTxLIGV4dGVuZHMga2V5b2YgQz4oa2V5OiBLLCB2YWx1ZTogQ1tLXSB8IHVuZGVmaW5lZCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAvLyBDYXN0IGBrZXlgIHRvIGBzdHJpbmcgfCBudW1iZXJgIChpLmUuLCBlbGltaW5hdGUgYHN5bWJvbGApLiBXZSBjb3VsZCB1c2UgYEV4dHJhY3Q8a2V5b2ZcbiAgICAgICAgLy8gQywgc3RyaW5nIHwgbnVtYmVyYCBpbiB0aGUgc291cmNlZ3JhcGguZC50cyB0eXBlIHNpZ25hdHVyZSwgYnV0IHRoYXQgd291bGQgYWRkIHVzZWxlc3NcbiAgICAgICAgLy8gY29tcGxleGl0eS5cbiAgICAgICAgYXdhaXQgdGhpcy5wcm94eS4kYWNjZXB0Q29uZmlndXJhdGlvblVwZGF0ZSh7IHBhdGg6IFtrZXkgYXMgc3RyaW5nIHwgbnVtYmVyXSwgdmFsdWUgfSlcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IFJlYWRvbmx5PEM+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVxuICAgIH1cblxuICAgIHB1YmxpYyB0b0pTT04oKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVxuICAgIH1cbn1cblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqIEB0ZW1wbGF0ZSBDIC0gVGhlIGNvbmZpZ3VyYXRpb24gc2NoZW1hLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4dENvbmZpZ3VyYXRpb25BUEk8Qz4ge1xuICAgICRhY2NlcHRDb25maWd1cmF0aW9uRGF0YShkYXRhOiBSZWFkb25seTxDPik6IFByb21pc2U8dm9pZD5cbn1cblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqIEB0ZW1wbGF0ZSBDIC0gVGhlIGNvbmZpZ3VyYXRpb24gc2NoZW1hLlxuICovXG5leHBvcnQgY2xhc3MgRXh0Q29uZmlndXJhdGlvbjxDIGV4dGVuZHMgQ29uZmlndXJhdGlvbkNhc2NhZGU8YW55Pj4gaW1wbGVtZW50cyBFeHRDb25maWd1cmF0aW9uQVBJPEM+IHtcbiAgICBwcml2YXRlIGRhdGEgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFJlYWRvbmx5PEM+IHwgbnVsbD4obnVsbClcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJveHk6IENsaWVudENvbmZpZ3VyYXRpb25BUEkpIHt9XG5cbiAgICBwdWJsaWMgJGFjY2VwdENvbmZpZ3VyYXRpb25EYXRhKGRhdGE6IFJlYWRvbmx5PEM+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMuZGF0YS5uZXh0KE9iamVjdC5mcmVlemUoZGF0YSkpXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQoKTogc291cmNlZ3JhcGguQ29uZmlndXJhdGlvbjxDPiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGEudmFsdWVcbiAgICAgICAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbiBpcyBub3QgeWV0IGF2YWlsYWJsZS4gYHNvdXJjZWdyYXBoLmNvbmZpZ3VyYXRpb24uZ2V0YCBpcyBub3QgdXNhYmxlIHVudGlsIGFmdGVyIHRoZSBleHRlbnNpb24gYGFjdGl2YXRlYCBmdW5jdGlvbiBpcyBmaW5pc2hlZCBleGVjdXRpbmcuIFRoaXMgaXMgYSBrbm93biBpc3N1ZSBhbmQgd2lsbCBiZSBmaXhlZCBiZWZvcmUgdGhlIGJldGEgcmVsZWFzZSBvZiBTb3VyY2VncmFwaCBleHRlbnNpb25zLiBJbiB0aGUgbWVhbnRpbWUsIHdvcmsgYXJvdW5kIHRoaXMgbGltaXRhdGlvbiBieSBkZWZlcnJpbmcgY2FsbHMgdG8gYGdldGAuJ1xuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3QuZnJlZXplKG5ldyBFeHRDb25maWd1cmF0aW9uU2VjdGlvbjxDPih0aGlzLnByb3h5LCBkYXRhLm1lcmdlZCkpXG4gICAgfVxuXG4gICAgcHVibGljIHN1YnNjcmliZShuZXh0OiAoKSA9PiB2b2lkKTogc291cmNlZ3JhcGguVW5zdWJzY3JpYmFibGUge1xuICAgICAgICAvLyBEbyBub3QgZW1pdCB1bnRpbCB0aGUgY29uZmlndXJhdGlvbiBpcyBhdmFpbGFibGUuXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEucGlwZShmaWx0ZXIoZGF0YSA9PiBkYXRhICE9PSBudWxsKSkuc3Vic2NyaWJlKG5leHQpXG4gICAgfVxufVxuIl19