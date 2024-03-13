export interface Prefecture {
  prefCode: number
  prefName: string
}

export interface Population {
  year: number
  value: number
}

export type RegionMapType = {[region: string]: Prefecture[]}

export interface PopResult {
  label: string
  data: Population[]
}
