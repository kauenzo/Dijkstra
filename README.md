# Caminho Mais Barato Entre Capitais

Uma aplicação para encontrar o caminho mais econômico entre capitais brasileiras, considerando distâncias, pedágios e consumo de combustível.

## Sobre o Projeto

Esta aplicação utiliza o algoritmo de Dijkstra para calcular o caminho mais barato entre capitais brasileiras, levando em consideração:

- Distâncias entre as capitais
- Custos de pedágio
- Consumo de combustível do veículo
- Preço do combustível

O projeto foi desenvolvido com Vue.js/Nuxt e TypeScript, utilizando componentes do PrimeVue para a interface.

## Configuração

Certifique-se de ter o Node.js instalado em sua máquina. Em seguida, instale as dependências:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Executando o Projeto

Inicie o servidor de desenvolvimento em `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev
```

## Como Usar a Aplicação

### 1. Seleção de Capitais

- No primeiro campo, selecione a **Capital de Origem**
- No segundo campo, selecione a **Capital de Destino**
- As capitais devem ser diferentes para o cálculo funcionar

### 2. Parâmetros de Custo

- Informe o **Preço do Combustível** em R$/L (ex: 5.00)
- Informe a **Autonomia do Veículo** em Km/L (ex: 10.0)
- Ambos os valores devem ser maiores que zero

### 3. Cálculo do Caminho

- Clique no botão **Calcular Caminho Mais Barato**
- O sistema calculará a rota mais econômica entre as capitais selecionadas

### 4. Visualização dos Resultados

Após o cálculo, serão exibidos:

- **Caminho Mais Barato**: sequência de capitais que formam o caminho
- **Distância Total**: distância total em quilômetros
- **Custo Total da Viagem**: soma dos custos de combustível e pedágios
- **Custo com Pedágios**: valor total gasto com pedágios
- **Custo com Combustível**: valor total gasto com combustível

### 5. Detalhes do Algoritmo

- Clique no botão **Ver Detalhes do Algoritmo** para visualizar o passo a passo do cálculo
- Os logs mostram cada etapa do algoritmo de Dijkstra, com informações sobre os nós visitados e custos calculados

## Tratamento de Erros

A aplicação possui tratamento para diversos cenários de erro:

- Campos obrigatórios não preenchidos
- Valores numéricos inválidos (zero ou negativos)
- Mesma capital selecionada como origem e destino
- Rota inexistente entre as capitais selecionadas

## Produção

Para criar uma versão de produção da aplicação:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build
```

Para visualizar localmente a versão de produção:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
