export interface ResponsePaginate<T> {
  current_page: number
  data: T
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links?: LinksEntity[] | null
  next_page_url: string
  path: string
  per_page: number
  prev_page_url?: null | string
  to: number
  total: number
}
export interface LinksEntity {
  url?: string | null
  label: string
  active: boolean
}
