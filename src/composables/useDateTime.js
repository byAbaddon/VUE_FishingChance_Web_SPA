// DATA TIME
import { ref, onMounted, onUnmounted } from 'vue'

const now = ref(new Date())
let interval;

export function useDataTimeNow() {
  onMounted(() => {
    interval = setInterval(() => {
      now.value = new Date()
    }, 1000)
  })

  onUnmounted(() => {
    clearInterval(interval)
  })

  return { now }
}