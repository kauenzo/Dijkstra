export type Graph = Record<string, Record<string, number>>

export type CityData = {
  toll: number
  neighbors: Record<string, number>
}

export type CitiesGraph = Record<string, CityData>
