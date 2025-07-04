import type { Graph, CityData, CitiesGraph } from '~/types/graph'
import capitaisData from '~/constants/capitais.json'

// Converte o array de objetos de cidades para um formato mais fácil de usar
const processCapitaisData = (): CitiesGraph => {
  const graph: CitiesGraph = {}
  
  capitaisData.forEach((item) => {
    const cityName = Object.keys(item)[0]
    graph[cityName] = item[cityName as keyof typeof item] as CityData
  })
  
  return graph
}

// Processa os dados do grafo
const citiesGraph = processCapitaisData()

// Define o tipo para os nós disponíveis no select
type NodeOption = { label: string; value: string }

// Define o tipo para os logs
type LogEntry = {
  type: 'info' | 'success' | 'warning' | 'error' | 'highlight' | 'step'
  message: string
}

// Define o tipo para os erros de validação
type ValidationError = {
  field: string
  message: string
}

// Estados para armazenar o nó inicial e o nó de destino
const startNode = ref<NodeOption | null>(null)
const endNode = ref<NodeOption | null>(null)

// Estados para armazenar o preço do combustível e a autonomia
const fuelPrice = ref<number>(5.0) // Valor padrão: R$ 5,00
const fuelEfficiency = ref<number>(10.0) // Valor padrão: 10 km/L

// Estado para armazenar o resultado do caminho
const pathResult = ref<{
  path: string[];
  totalDistance: number;
  totalToll: number;
  totalFuelCost: number;
  totalCost: number;
} | null>(null)

// Estado para armazenar os logs do algoritmo
const algorithmLogs = ref<LogEntry[]>([])

// Estado para controlar se o cálculo foi realizado
const calculationDone = ref(false)

// Estado para controlar a exibição dos logs detalhados
const showDetailedLogs = ref(false)

// Estado para armazenar erros de validação
const validationErrors = ref<ValidationError[]>([])

// Estado para controlar se há um erro de rota
const routeError = ref<string | null>(null)

// Lista de opções para os selects
const nodeOptions: NodeOption[] = Object.keys(citiesGraph).map((node) => ({
  label: node,
  value: node,
}))

// Função para adicionar logs
const addLog = (type: LogEntry['type'], message: string) => {
  algorithmLogs.value.push({ type, message })
}

// Função para limpar os logs
const clearLogs = () => {
  algorithmLogs.value = []
}

// Função para limpar erros de validação
const clearErrors = () => {
  validationErrors.value = []
  routeError.value = null
}

// Função para alternar a exibição dos logs detalhados
const toggleDetailedLogs = () => {
  showDetailedLogs.value = !showDetailedLogs.value
}

// Função para validar os inputs antes do cálculo
const validateInputs = (): boolean => {
  clearErrors()
  
  if (!startNode.value) {
    validationErrors.value.push({
      field: 'startNode',
      message: 'Selecione a capital de origem'
    })
  }
  
  if (!endNode.value) {
    validationErrors.value.push({
      field: 'endNode',
      message: 'Selecione a capital de destino'
    })
  }
  
  if (fuelPrice.value <= 0) {
    validationErrors.value.push({
      field: 'fuelPrice',
      message: 'O preço do combustível deve ser maior que zero'
    })
  }
  
  if (fuelEfficiency.value <= 0) {
    validationErrors.value.push({
      field: 'fuelEfficiency',
      message: 'A autonomia do veículo deve ser maior que zero'
    })
  }
  
  return validationErrors.value.length === 0
}

// Algoritmo de Dijkstra adaptado para calcular o caminho mais barato
const dijkstra = (start: string, end: string, fuelPriceValue: number, fuelEfficiencyValue: number): {
  path: string[];
  totalDistance: number;
  totalToll: number;
  totalFuelCost: number;
  totalCost: number;
} => {
  clearLogs()
  
  addLog('info', `Iniciando cálculo do caminho mais barato de "${start}" até "${end}"`)
  addLog('info', `Preço do combustível: R$ ${fuelPriceValue.toFixed(2)}/L`)
  addLog('info', `Autonomia: ${fuelEfficiencyValue.toFixed(2)} km/L`)
  
  let caminhoEncontrado = false;

  // Inicializa as estruturas de dados
  const costs: Record<string, number> = {}; // Custo total (combustível + pedágio)
  const distances: Record<string, number> = {}; // Distância total
  const tolls: Record<string, number> = {}; // Pedágio total
  const fuelCosts: Record<string, number> = {}; // Custo de combustível
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const nodes = Object.keys(citiesGraph);
  
  // Inicializa os valores para todos os nós
  nodes.forEach((node) => {
    costs[node] = Infinity;
    distances[node] = Infinity;
    tolls[node] = Infinity;
    fuelCosts[node] = Infinity;
    previous[node] = null;
  });
  
  // Define os valores iniciais para o nó de origem
  costs[start] = 0;
  distances[start] = 0;
  tolls[start] = 0;
  fuelCosts[start] = 0;
  
  // Cria uma cópia dos nós para processar
  const unvisitedNodes = [...nodes];
  
  addLog('step', `Iniciando algoritmo de Dijkstra`)
  
  while (unvisitedNodes.length) {
    // Ordena os nós não visitados por custo total
    unvisitedNodes.sort((a, b) => costs[a] - costs[b]);
    
    // Pega o nó com menor custo
    let currentNode = unvisitedNodes.shift() as string;
    
    addLog('highlight', `Analisando: ${currentNode}`)
    addLog('info', `Custo atual: R$ ${costs[currentNode].toFixed(2)} | Distância: ${distances[currentNode]} km | Pedágio: R$ ${tolls[currentNode].toFixed(2)} | Combustível: R$ ${fuelCosts[currentNode].toFixed(2)}`)
    
    // Se o custo for infinito, não há caminho possível
    if (costs[currentNode] === Infinity) {
      addLog('error', `Nenhum caminho encontrado a partir deste nó.`)
      break;
    }
    
    // Se chegamos ao destino, terminamos
    if (currentNode === end) {
      addLog('success', `Destino "${end}" alcançado!`)
      caminhoEncontrado = true;
      break;
    }
    
    // Marca o nó como visitado
    visited.add(currentNode);
    const currentCityData = citiesGraph[currentNode];
    let vizinhosVisitados = 0;
    
    // Processa os vizinhos do nó atual
    if (currentCityData && currentCityData.neighbors) {
      for (let neighbor in currentCityData.neighbors) {
        if (!visited.has(neighbor)) {
          vizinhosVisitados++;
          
          // Calcula a distância até o vizinho
          const distance = currentCityData.neighbors[neighbor];
          const newDistance = distances[currentNode] + distance;
          
          // Calcula o custo do combustível para este trecho
          const fuelCostForSegment = (distance / fuelEfficiencyValue) * fuelPriceValue;
          const newFuelCost = fuelCosts[currentNode] + fuelCostForSegment;
          
          // Calcula o pedágio acumulado (considera o pedágio da cidade vizinha)
          const neighborToll = citiesGraph[neighbor]?.toll || 0;
          const newToll = tolls[currentNode] + neighborToll;
          
          // Calcula o custo total (combustível + pedágio)
          const newCost = newFuelCost + newToll;
          
          // Se o novo custo for menor, atualiza os valores
          if (newCost < costs[neighbor]) {
            costs[neighbor] = newCost;
            distances[neighbor] = newDistance;
            tolls[neighbor] = newToll;
            fuelCosts[neighbor] = newFuelCost;
            previous[neighbor] = currentNode;
            
            addLog('step', `Explorando: ${neighbor}`)
            addLog('info', `Novo custo: R$ ${newCost.toFixed(2)} | Distância: ${newDistance} km | Pedágio: R$ ${newToll.toFixed(2)} | Combustível: R$ ${newFuelCost.toFixed(2)}`)
          }
        }
      }
    }
    
    if (vizinhosVisitados === 0) {
      addLog('warning', `Nenhum vizinho acessível, voltando para um nó anterior...`)
    }
  }
  
  // Reconstrói o caminho
  const path: string[] = [];
  let current: string | null = end;
  
  while (current) {
    path.unshift(current);
    current = previous[current];
  }
  
  // Gera o relatório final
  if (caminhoEncontrado) {
    addLog('success', `Caminho mais barato encontrado: ${path.join(' → ')}`)
    addLog('info', `Distância total: ${distances[end]} km`)
    addLog('info', `Pedágio total: R$ ${tolls[end].toFixed(2)}`)
    addLog('info', `Custo de combustível: R$ ${fuelCosts[end].toFixed(2)}`)
    addLog('highlight', `Custo total da viagem: R$ ${costs[end].toFixed(2)}`)
  } else {
    addLog('error', `Nenhum caminho possível de "${start}" até "${end}".`)
    routeError.value = `Não foi possível encontrar uma rota entre ${start} e ${end}. Verifique se existe uma conexão entre essas capitais.`
  }
  
  console.log('Logs gerados:', algorithmLogs.value);
  
  return {
    path: caminhoEncontrado ? path : [`Nenhum caminho encontrado de ${start} até ${end}`],
    totalDistance: caminhoEncontrado ? distances[end] : 0,
    totalToll: caminhoEncontrado ? tolls[end] : 0,
    totalFuelCost: caminhoEncontrado ? fuelCosts[end] : 0,
    totalCost: caminhoEncontrado ? costs[end] : 0
  };
};

// Função para calcular o caminho mais barato
const calculateCheapestPath = () => {
  // Limpa resultados anteriores
  pathResult.value = null;
  calculationDone.value = false;
  clearLogs();
  clearErrors();
  
  // Valida os inputs
  if (!validateInputs()) {
    console.log(`🚨 Erros de validação: ${validationErrors.value.map(e => e.message).join(', ')}`);
    return null;
  }
  
  if (startNode.value && endNode.value) {
    // Verifica se as capitais são iguais
    if (startNode.value.value === endNode.value.value) {
      validationErrors.value.push({
        field: 'endNode',
        message: 'A capital de destino deve ser diferente da capital de origem'
      });
      return null;
    }
    
    console.log(`🛠️ Executando Dijkstra para encontrar o caminho mais barato...`);
    const result = dijkstra(
      startNode.value.value, 
      endNode.value.value, 
      fuelPrice.value, 
      fuelEfficiency.value
    );
    
    console.log(`🚀 Caminho final: ${result.path.join(' → ')}`);
    
    // Armazena o resultado para exibição na interface
    pathResult.value = result;
    calculationDone.value = true;
    
    return result;
  }
  
  return null;
};

export { 
  nodeOptions, 
  calculateCheapestPath,
  dijkstra, 
  startNode, 
  endNode, 
  fuelPrice, 
  fuelEfficiency,
  pathResult,
  calculationDone,
  algorithmLogs,
  showDetailedLogs,
  toggleDetailedLogs,
  validationErrors,
  routeError
}

