<script setup lang="ts">
import {
  nodeOptions,
  calculateCheapestPath,
  startNode,
  endNode,
  fuelPrice,
  fuelEfficiency,
  validationErrors
} from '~/composables/useDjisktra'

// Função para verificar se um campo tem erro
const hasError = (fieldName: string) => {
  return validationErrors.value.some(error => error.field === fieldName)
}

// Função para obter a mensagem de erro de um campo
const getErrorMessage = (fieldName: string) => {
  const error = validationErrors.value.find(error => error.field === fieldName)
  return error ? error.message : ''
}
</script>

<template>
  <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-6 backdrop-blur-sm bg-opacity-80 relative overflow-hidden">
    <!-- Decoração do card -->
    <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
    
    <h2 class="text-xl font-semibold mb-6 text-gray-200 flex items-center">
      <i class="pi pi-map-marker mr-2 text-cyan-400"></i>
      Selecione as Capitais
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="relative">
        <label class="text-sm font-medium mb-2 text-gray-300 flex items-center">
          <i class="pi pi-home mr-1 text-green-400"></i>
          Capital de Origem
        </label>
        <Select
          :virtualScrollerOptions="{ itemSize: 38 }"
          v-model="startNode"
          editable
          :options="nodeOptions"
          optionLabel="label"
          placeholder="Selecione a capital de origem"
          class="w-full select-origin"
          :class="{ 'p-invalid': hasError('startNode') }"
        />
        <div class="select-decoration origin"></div>
        <small v-if="hasError('startNode')" class="text-red-400 mt-1 block">{{ getErrorMessage('startNode') }}</small>
      </div>
      
      <div class="relative">
        <label class="text-sm font-medium mb-2 text-gray-300 flex items-center">
          <i class="pi pi-flag mr-1 text-red-400"></i>
          Capital de Destino
        </label>
        <Select
          :virtualScrollerOptions="{ itemSize: 38 }"
          v-model="endNode"
          editable
          :options="nodeOptions"
          optionLabel="label"
          placeholder="Selecione a capital de destino"
          class="w-full select-destination"
          :class="{ 'p-invalid': hasError('endNode') }"
        />
        <div class="select-decoration destination"></div>
        <small v-if="hasError('endNode')" class="text-red-400 mt-1 block">{{ getErrorMessage('endNode') }}</small>
      </div>
    </div>
    
    <h2 class="text-xl font-semibold mb-6 text-gray-200 flex items-center">
      <i class="pi pi-dollar mr-2 text-yellow-400"></i>
      Parâmetros de Custo
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="relative">
        <label class="text-sm font-medium mb-2 text-gray-300 flex items-center">
          <i class="pi pi-gas-pump mr-1 text-orange-400"></i>
          Preço do Combustível (R$/L)
        </label>
        <InputNumber
          v-model="fuelPrice"
          :min="0"
          :step="0.01"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          placeholder="Ex: 5.00"
          class="w-full"
          :class="{ 'p-invalid': hasError('fuelPrice') }"
        />
        <div class="input-decoration fuel"></div>
        <small v-if="hasError('fuelPrice')" class="text-red-400 mt-1 block">{{ getErrorMessage('fuelPrice') }}</small>
      </div>
      
      <div class="relative">
        <label class="text-sm font-medium mb-2 text-gray-300 flex items-center">
          <i class="pi pi-car mr-1 text-blue-400"></i>
          Autonomia (Km/L)
        </label>
        <InputNumber
          v-model="fuelEfficiency"
          :min="0.1"
          :step="0.1"
          mode="decimal"
          :minFractionDigits="1"
          :maxFractionDigits="1"
          placeholder="Ex: 10.0"
          class="w-full"
          :class="{ 'p-invalid': hasError('fuelEfficiency') }"
        />
        <div class="input-decoration efficiency"></div>
        <small v-if="hasError('fuelEfficiency')" class="text-red-400 mt-1 block">{{ getErrorMessage('fuelEfficiency') }}</small>
      </div>
    </div>
    
    <div class="flex justify-center mt-8">
      <Button
        label="Calcular Caminho Mais Barato"
        icon="pi pi-search"
        class="p-button-primary calculate-btn"
        @click="calculateCheapestPath"
      />
    </div>
  </div>
</template>

<style scoped>
/* Decoração dos campos de seleção */
.select-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.select-decoration.origin {
  background: linear-gradient(to right, #10b981, #059669);
}

.select-decoration.destination {
  background: linear-gradient(to right, #ef4444, #dc2626);
}

.select-origin:focus-within + .select-decoration.origin,
.select-destination:focus-within + .select-decoration.destination {
  transform: scaleX(1);
}

/* Decoração dos campos de input */
.input-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.input-decoration.fuel {
  background: linear-gradient(to right, #f97316, #ea580c);
}

.input-decoration.efficiency {
  background: linear-gradient(to right, #3b82f6, #2563eb);
}

:deep(.p-inputnumber:focus-within) + .input-decoration {
  transform: scaleX(1);
}

/* Estilo para campos com erro */
:deep(.p-invalid) {
  border-color: rgba(239, 68, 68, 0.5) !important;
}

:deep(.p-invalid:hover),
:deep(.p-invalid:focus) {
  border-color: rgba(239, 68, 68, 0.8) !important;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.2) !important;
}
</style> 