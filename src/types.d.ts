export interface Prefecture {
  prefCode: number
  prefName: string
}

export interface Population {
  year: number
  value: number
}

export interface PopResult {
  label: string
  data: Population[]
}