<script setup lang="ts">
import { defineProps } from 'vue'
import { User, TrendingUp, ExternalLink } from 'lucide-vue-next'
import './style.css'

const props = defineProps<{
  id: number
  title: string
  url: string
  by: string
  score: number
}>()
</script>

<template>
  <li class="story-card">
    <div class="card-content">
      <div class="card-meta">
        <div class="meta-item">
          <User :size="14" />
          <span class="author">{{ by }}</span>
        </div>
        <span class="separator">·</span>
        <div class="meta-item">
          <TrendingUp :size="14" />
          <span class="score">{{ score }} pontos</span>
        </div>
      </div>

      <h3 class="story-title">
        <a :href="url" target="_blank" rel="noopener">
          {{ title }}
          <ExternalLink :size="14" class="external-link-icon" />
        </a>
      </h3>
    </div>
  </li>
</template>
