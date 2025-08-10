<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RefreshCw, Loader2, AlertCircle } from 'lucide-vue-next'
import StoryCard from './_components/StoryCard/StoryCard.vue'
import './App.css'

interface Story {
  id: number
  title: string
  url: string
  by: string
  score: number
  kids?: number[]
}

const stories = ref<Story[]>([])
const loading = ref(true)
const error = ref('')

async function fetchTopStories() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('http://localhost:3000/api/v1/hackernews/top_stories')
    if (!res.ok) throw new Error('Erro ao buscar notícias')
    stories.value = await res.json()
  } catch (e: any) {
    error.value = e.message || 'Erro desconhecido'
  } finally {
    loading.value = false
  }
}

onMounted(fetchTopStories)
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <h1 class="title">Hacker News</h1>
        <button @click="fetchTopStories" class="refresh-btn" title="Atualizar">
          <RefreshCw :size="18" />
        </button>
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
        <button @click="fetchTopStories" class="retry-btn">Tentar novamente</button>
      </div>

      <div v-else class="stories-container">
        <ul class="stories-list">
          <StoryCard v-for="story in stories" :key="story.id" v-bind="story" />
        </ul>
      </div>
    </main>
  </div>
</template>
