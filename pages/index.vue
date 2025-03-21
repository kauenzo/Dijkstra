<script setup lang="ts">
import {
  nodeOptions,
  getGraph,
  startNode,
  endNode,
} from '~/composables/useDjisktra'
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <Dropdown
      v-model="startNode"
      :options="nodeOptions"
      placeholder="Selecione o nó inicial"
      class="w-full"
      optionLabel="label"
    />
    <Dropdown
      v-model="endNode"
      :options="nodeOptions"
      placeholder="Selecione o nó final"
      class="w-full"
      optionLabel="label"
    />

    <Button
      label="Calcular Caminho"
      @click="getGraph"
    />
    <Button
      label="Console"
      @click="() => console.log(nodeOptions)"
    />
  </div>
</template>

