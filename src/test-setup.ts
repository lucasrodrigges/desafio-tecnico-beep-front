import { config } from '@vue/test-utils'
import * as Vue from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).Vue = Vue

config.global.mocks = {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).importMeta = {
  env: {
    VITE_API_BASE_URL: 'http://localhost:3000/api/v1'
  }
}

Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: 'http://localhost:3000/api/v1'
      }
    }
  },
  writable: true,
  configurable: true
})
