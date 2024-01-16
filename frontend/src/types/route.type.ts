export type RouteType = {
    route: string,
    title: string,
    template: string,
    load(type?: string): void
}