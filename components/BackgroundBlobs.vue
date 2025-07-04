<template>
  <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  </div>
</template>

<style scoped>
/* Elementos decorativos de fundo */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}

.blob-1 {
  width: 300px;
  height: 300px;
  background: rgba(6, 182, 212, 0.1);
  top: 10%;
  left: 15%;
  animation: float 15s ease-in-out infinite;
}

.blob-2 {
  width: 350px;
  height: 350px;
  background: rgba(59, 130, 246, 0.1);
  top: 40%;
  right: 10%;
  animation: float 18s ease-in-out infinite reverse;
}

.blob-3 {
  width: 250px;
  height: 250px;
  background: rgba(124, 58, 237, 0.1);
  bottom: 10%;
  left: 30%;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}
</style> 