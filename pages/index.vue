<script setup lang="ts">
import {
  calculationDone,
  pathResult,
  routeError
} from '~/composables/useDjisktra'

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

// Função para filtrar as cidades no Autocomplete
const filteredStartCities = ref<typeof nodeOptions>([]);
const filteredEndCities = ref<typeof nodeOptions>([]);

const searchStartCity = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  filteredStartCities.value = nodeOptions.filter(city => 
    city.label.toLowerCase().includes(query)
  );
};

const searchEndCity = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  filteredEndCities.value = nodeOptions.filter(city => 
    city.label.toLowerCase().includes(query)
  );
};
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl relative">
    <!-- Elementos decorativos de fundo -->
    <BackgroundBlobs />
    
    <!-- Conteúdo principal -->
    <div class="relative z-10">
      <AppHeader />
      
      <FormCard />
      
      <ResultCard v-if="(calculationDone && pathResult) || routeError" :pathResult="pathResult" />

    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
}
</style>

