import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    psd: null,
    layers: []
  }),
  actions: {
    setPsd(data) {
      this.psd = data
    },
    setLayers(list) {
      this.layers = list
    }
  }
})
