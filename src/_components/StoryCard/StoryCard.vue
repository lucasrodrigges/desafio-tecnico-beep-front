<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { User, TrendingUp, ExternalLink, MessageSquare } from 'lucide-vue-next'
import CommentsModal from '../CommentsModal/CommentsModal.vue'
import './style.css'
import type { Story } from '../../_types/story'

const props = defineProps<Story>()

const isModalOpen = ref(false)

const openCommentsModal = () => {
  if (props.comments && props.comments.length) {
    isModalOpen.value = true
  }
}

const closeModal = () => {
  isModalOpen.value = false
}
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
        <span class="separator">·</span>
        <div
          v-if="props.comments && props.comments.length > 0"
          class="meta-item comments-clickable"
          @click="openCommentsModal"
        >
          <MessageSquare :size="14" />
          <span class="comments">{{ props.comments.length }} comentários</span>
        </div>
      </div>

      <h3 class="story-title">
        <a :href="url" target="_blank" rel="noopener">
          {{ title }}
          <ExternalLink :size="14" class="external-link-icon" />
        </a>
      </h3>
    </div>

    <CommentsModal
      :is-open="isModalOpen"
      :root-comments="props.comments || []"
      @close="closeModal"
    />
  </li>
</template>
