<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Loader2, AlertCircle, Circle, Search } from 'lucide-vue-next'
import StoryCard from './_components/StoryCard/StoryCard.vue'
import * as ActionCable from '@rails/actioncable'
import './App.css'
import type { Story } from './_types/story'
import _api from './_api'

const stories = ref<Story[]>([])
const loading = ref(true)
const error = ref('')
const online = ref(false)
const searchQuery = ref('')
const isSearching = ref(false)
const isPageVisible = ref(!document.hidden)
let cable: ActionCable.Consumer | null = null
let subscription: unknown = null
let searchTimeout: ReturnType<typeof setTimeout> | null = null
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null

async function fetchStories() {
  loading.value = true
  stories.value = await _api.stories.fetchTopStories()
  loading.value = false
}

async function searchStories(query: string) {
  if (!query.trim()) {
    await fetchStories()
    return
  }

  isSearching.value = true
  error.value = ''
  stories.value = await _api.stories.searchStories(query)
  isSearching.value = false
}

function debouncedSearch(query: string) {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    searchStories(query)
  }, 600)
}

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery)
})

function connectCable() {
  loading.value = true
  error.value = ''
  if (cable) {
    cable.disconnect()
    cable = null
  }
  const wsUrl = import.meta.env.VITE_API_BASE_URL.replace('http://', 'ws://').replace(
    '/api/v1',
    '/cable',
  )
  cable = ActionCable.createConsumer(wsUrl)
  subscription = cable.subscriptions.create(
    { channel: 'TopStoriesChannel' },
    {
      connected(): void {
        online.value = true
        loading.value = false
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout)
          reconnectTimeout = null
        }
      },
      disconnected(): void {
        online.value = false
        if (isPageVisible.value) {
          error.value = 'Desconectado do servidor.'
        }
      },
      received(data: Story[]): void {
        if (data[0] !== stories.value[0] && !searchQuery.value) {
          stories.value = data
        }
      },
      rejected(): void {
        online.value = false
        error.value = 'Conexão rejeitada.'
      },
    },
  )
}

function disconnectCable() {
  if (subscription) {
    ;(subscription as { unsubscribe(): void }).unsubscribe()
    subscription = null
  }
  if (cable) {
    cable.disconnect()
    cable = null
  }
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }
}

function handleVisibilityChange() {
  isPageVisible.value = !document.hidden

  if (isPageVisible.value) {
    if (!online.value) {
      reconnectTimeout = setTimeout(() => {
        connectCable()
      }, 1000)
    }
    if (error.value === 'Desconectado do servidor.') {
      error.value = ''
    }
  } else {
    if (error.value === 'Desconectado do servidor.') {
      error.value = ''
    }
  }
}

onMounted(async () => {
  await fetchStories()
  connectCable()

  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  disconnectCable()
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <h1 class="title">Hacker News</h1>
        <span
          class="status-indicator"
          :title="online ? 'Online e buscando atualizações' : 'Offline'"
        >
          <Circle
            :size="16"
            :color="online ? 'var(--success-fg)' : 'var(--danger-fg)'"
            fill="currentColor"
            class="animate-pulse"
          />
        </span>
      </div>

      <div class="search-container">
        <div class="search-input-wrapper">
          <Search :size="20" class="search-icon" />
          <input v-model="searchQuery" type="text" placeholder="Buscar..." class="search-input" />
          <div v-if="isSearching" class="search-loading">
            <Loader2 :size="16" class="spinner-icon" />
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <div v-if="loading" class="loading">
        <Loader2 :size="32" class="spinner-icon" />
        <span>Carregando...</span>
      </div>

      <div v-else-if="error" class="error">
        <AlertCircle :size="24" class="error-icon" />
        <p>{{ error }}</p>
      </div>

      <div v-else-if="stories.length === 0" class="no-stories">
        <p>Nenhuma notícia encontrada</p>
      </div>

      <div v-else class="stories-container">
        <ul class="stories-list">
          <StoryCard v-for="story in stories" :key="story.id" v-bind="story" />
        </ul>
      </div>
    </main>
  </div>
</template>
