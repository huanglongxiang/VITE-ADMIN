export interface NavItemType {
    index: string
    title: string
    icon?: string
    type?: string
    children?: NavItemType[],
    titles: string[],
    indexes: string[]
}

export interface RouteConfig {
  path: string
  name: string
  meta: {
    title: string
    icon?: string
  }
  component: () => Promise<any>
}