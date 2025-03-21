import { GraphXXI } from '~/constants/graphxxi'
import type { Graph } from '~/types/graph'

// Importa o grafo definido em outro arquivo

// Define o tipo para os nós disponíveis no select
type NodeOption = { label: string; value: string }

// Estados para armazenar o nó inicial e o nó de destino
const startNode = ref<NodeOption | null>(null)
const endNode = ref<NodeOption | null>(null)

// Lista de opções para os selects
const nodeOptions: NodeOption[] = Object.keys(GraphXXI).map((node) => ({
  label: node,
  value: node,
}))

const dijkstra = (graph: Graph, start: string, end: string): string[] => {
  let log = `🟢 Iniciando Dijkstra de "${start}" até "${end}"\n`
  let caminhoEncontrado = false

  const distances: Record<string, number> = {}
  const previous: Record<string, string | null> = {}
  const visited = new Set<string>()
  const nodes = Object.keys(graph)

  nodes.forEach((node) => {
    distances[node] = Infinity
    previous[node] = null
  })
  distances[start] = 0

  while (nodes.length) {
    nodes.sort((a, b) => distances[a] - distances[b])
    let closestNode = nodes.shift() as string

    log += `\n===========================\n`
    log += `🏁 Nó escolhido: "${closestNode}" | Distância atual: ${distances[closestNode]}\n`
    log += `===========================\n`

    if (distances[closestNode] === Infinity) {
      log += `🚫 Nenhum caminho encontrado a partir deste nó.\n`
      break
    }

    if (closestNode === end) {
      log += `🎯 Destino "${end}" alcançado!\n`
      caminhoEncontrado = true
      break
    }

    visited.add(closestNode)
    let vizinhosVisitados = 0

    for (let neighbor in graph[closestNode]) {
      if (!visited.has(neighbor)) {
        vizinhosVisitados++
        let newDistance = distances[closestNode] + graph[closestNode][neighbor]

        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance
          previous[neighbor] = closestNode
          log += `  ➡️ Explorando vizinho: "${neighbor}" | Nova distância: ${newDistance} (via "${closestNode}")\n`
        }
      }
    }

    if (vizinhosVisitados === 0) {
      log += `  🔄 Nenhum vizinho acessível, voltando para um nó anterior...\n`
    }
  }

  const path: string[] = []
  let current: string | null = end

  while (current) {
    path.unshift(current)
    current = previous[current]
  }

  log += `\n===========================\n`
  if (caminhoEncontrado) {
    log += `🛣️ Caminho mais curto encontrado: ${path.join(' -> ')}\n`
  } else {
    log += `⚠️ Nenhum caminho possível de "${start}" até "${end}".\n`
  }
  log += `===========================\n`

  console.log(log)
  return caminhoEncontrado
    ? path
    : [`Nenhum caminho encontrado de ${start} até ${end}`]
}

const getGraph = () => {
  if (!startNode.value || !endNode.value) {
    console.log(
      `🚨 Selecione os nós de início e destino antes de calcular o caminho.`
    )
    return
  }

  console.log(`🛠️ Executando Dijkstra para encontrar o menor caminho...`)
  const path = dijkstra(GraphXXI, startNode.value.value, endNode.value.value)
  console.log(`🚀 Caminho final: ${path.join(' -> ')}`)

  return { getGraph, dijkstra, nodeOptions }
}
export { nodeOptions, getGraph, dijkstra, startNode, endNode }

