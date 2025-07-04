<script setup lang="ts">
import { ref } from 'vue'
import {
  algorithmLogs,
  showDetailedLogs,
  toggleDetailedLogs,
  routeError
} from '~/composables/useDjisktra'
import type { Graph, CityData, CitiesGraph } from '~/types/graph'

// Definição do tipo para o resultado do caminho
interface PathResult {
  path: string[];
  totalDistance: number;
  totalToll: number;
  totalFuelCost: number;
  totalCost: number;
}

// Definição do tipo para os logs
interface LogEntry {
  type: 'info' | 'success' | 'warning' | 'error' | 'highlight' | 'step';
  message: string;
}

// Props
defineProps({
  pathResult: {
    type: Object as () => PathResult,
    required: false,
    default: null
  }
})

// Função para obter a classe CSS com base no tipo de log
const getLogClass = (type: string) => {
  switch (type) {
    case 'info': return 'text-gray-300'
    case 'success': return 'text-green-400'
    case 'warning': return 'text-yellow-400'
    case 'error': return 'text-red-400'
    case 'highlight': return 'text-cyan-400 font-bold'
    case 'step': return 'text-purple-400'
    default: return 'text-gray-300'
  }
}

// Função para obter o ícone com base no tipo de log
const getLogIcon = (type: string) => {
  switch (type) {
    case 'info': return 'pi-info-circle'
    case 'success': return 'pi-check-circle'
    case 'warning': return 'pi-exclamation-triangle'
    case 'error': return 'pi-times-circle'
    case 'highlight': return 'pi-star'
    case 'step': return 'pi-arrow-right'
    default: return 'pi-circle'
  }
}
</script>

<template>
  <div class="mt-8 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 backdrop-blur-sm bg-opacity-80 relative overflow-hidden animate-fadeIn">
    <!-- Decoração do card de resultado -->
    <div class="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-br-full"></div>
    <div class="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-tl-full"></div>
    
    <h2 class="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center">
      <i class="pi pi-check-circle mr-2"></i>
      Resultado
    </h2>
    
    <!-- Mensagem de erro de rota -->
    <div v-if="routeError" class="text-red-400 text-center p-6 bg-gray-900/80 rounded-lg border border-red-800 shadow-inner mb-6 animate-fadeIn">
      <i class="pi pi-exclamation-triangle text-3xl mb-3"></i>
      <p class="text-lg font-medium mb-2">Erro ao calcular rota</p>
      <p>{{ routeError }}</p>
    </div>
    
    <div v-else-if="pathResult && pathResult.path.length === 1 && pathResult.path[0].startsWith('Nenhum')" class="text-red-400 text-center p-6 bg-gray-900/80 rounded-lg border border-red-800 shadow-inner">
      <i class="pi pi-exclamation-triangle text-3xl mb-2"></i>
      <p class="text-lg">{{ pathResult.path[0] }}</p>
    </div>
    
    <div v-else-if="pathResult">
      <h3 class="text-lg font-medium mb-3 text-gray-300 flex items-center">
        <i class="pi pi-map mr-2 text-cyan-400"></i>
        Caminho Mais Barato:
      </h3>
      <div class="bg-gray-900/80 p-5 rounded-lg mb-6 border border-gray-700 shadow-inner path-container">
        <div class="flex flex-wrap items-center justify-center">
          <template v-for="(city, index) in pathResult.path" :key="index">
            <span class="city-node">{{ city }}</span>
            <i v-if="index < pathResult.path.length - 1" class="pi pi-arrow-right text-cyan-500 mx-2"></i>
          </template>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-900/80 p-5 rounded-lg border border-gray-700 shadow-inner transform hover:scale-105 transition-transform">
          <div class="flex items-center">
            <div class="mr-4 bg-blue-500/20 p-3 rounded-full">
              <i class="pi pi-map-marker text-blue-400 text-xl"></i>
            </div>
            <div>
              <h4 class="font-medium mb-1 text-gray-300">Distância Total:</h4>
              <p class="text-2xl font-bold text-gray-100">{{ pathResult.totalDistance.toLocaleString() }} <span class="text-sm text-gray-400">km</span></p>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-900/80 p-5 rounded-lg border border-gray-700 shadow-inner transform hover:scale-105 transition-transform">
          <div class="flex items-center">
            <div class="mr-4 bg-cyan-500/20 p-3 rounded-full">
              <i class="pi pi-dollar text-cyan-400 text-xl"></i>
            </div>
            <div>
              <h4 class="font-medium mb-1 text-gray-300">Custo Total da Viagem:</h4>
              <p class="text-2xl font-bold text-cyan-400">R$ {{ pathResult.totalCost.toFixed(2) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-900/80 p-5 rounded-lg border border-gray-700 shadow-inner transform hover:scale-105 transition-transform">
          <div class="flex items-center">
            <div class="mr-4 bg-yellow-500/20 p-3 rounded-full">
              <i class="pi pi-ticket text-yellow-400 text-xl"></i>
            </div>
            <div>
              <h4 class="font-medium mb-1 text-gray-300">Custo com Pedágios:</h4>
              <p class="text-xl text-gray-200">R$ {{ pathResult.totalToll.toFixed(2) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-900/80 p-5 rounded-lg border border-gray-700 shadow-inner transform hover:scale-105 transition-transform">
          <div class="flex items-center">
            <div class="mr-4 bg-green-500/20 p-3 rounded-full">
              <i class="pi pi-gas-pump text-green-400 text-xl"></i>
            </div>
            <div>
              <h4 class="font-medium mb-1 text-gray-300">Custo com Combustível:</h4>
              <p class="text-xl text-gray-200">R$ {{ pathResult.totalFuelCost.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-center mb-6">
        <Button
          :label="showDetailedLogs ? 'Ocultar Detalhes do Algoritmo' : 'Ver Detalhes do Algoritmo'"
          :icon="showDetailedLogs ? 'pi pi-eye-slash' : 'pi pi-eye'"
          class="p-button-info details-btn"
          @click="toggleDetailedLogs"
        />
      </div>
      
      <!-- Seção de logs detalhados -->
      <div v-if="showDetailedLogs" class="bg-gray-900/80 p-5 rounded-lg border border-gray-700 mt-4 shadow-inner animate-fadeIn">
        <h3 class="text-lg font-medium mb-4 text-gray-300 flex items-center">
          <i class="pi pi-code mr-2 text-purple-400"></i>
          Detalhes do Algoritmo de Dijkstra
        </h3>
        
        <div class="bg-gray-950 p-5 rounded-lg border border-gray-700 h-80 overflow-y-auto logs-bg">
          <div class="logs-container">
            <div v-for="(log, index) in algorithmLogs" :key="index" class="log-entry mb-2 animate-fadeIn" :style="{ animationDelay: index * 50 + 'ms' }">
              <div class="flex items-start">
                <i :class="['pi', getLogIcon(log.type), getLogClass(log.type), 'mr-2 mt-1']"></i>
                <div :class="[getLogClass(log.type)]">
                  {{ log.message }}
                </div>
              </div>
            </div>
            
            <div v-if="algorithmLogs.length === 0" class="text-center text-gray-500 py-4">
              Nenhum log disponível.
            </div>
          </div>
        </div>
        
        <div class="mt-4 text-sm text-gray-400 flex items-center">
          <i class="pi pi-info-circle mr-1 text-blue-400"></i>
          Esta visualização mostra o passo a passo do algoritmo de Dijkstra utilizado para encontrar o caminho mais barato.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilização dos nós de cidade no caminho */
.city-node {
  background: rgba(8, 145, 178, 0.2);
  border: 1px solid rgba(8, 145, 178, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  margin: 0.25rem;
  font-weight: 500;
  color: #e2e8f0;
}

/* Animações */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logs-container {
  font-family: 'Consolas', 'Monaco', monospace;
}

.logs-bg {
  background-image: 
    linear-gradient(to bottom, rgba(8, 47, 73, 0.3), rgba(8, 47, 73, 0.3)),
    linear-gradient(to right, rgba(8, 47, 73, 0.1), rgba(8, 47, 73, 0));
}

.path-container {
  background-image: linear-gradient(to right, rgba(8, 47, 73, 0.2), rgba(8, 47, 73, 0), rgba(8, 47, 73, 0.2));
}
</style> 