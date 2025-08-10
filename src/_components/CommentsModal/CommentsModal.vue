<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import './style.css'

interface Comment {
  id: number
  by: string
  text: string
  time: number
  kids?: number[]
}

const props = defineProps<{
  isOpen: boolean
  storyId: number
}>()

const emit = defineEmits<{
  close: []
}>()

const comments = ref<Comment[]>([])
const isLoadingComments = ref(false)

const fetchComments = async () => {
  if (!props.storyId) return

  isLoadingComments.value = true

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/hackernews/${props.storyId}/relevant_comments`,
    )
    const data = await response.json()
    comments.value = data
  } catch (error) {
    console.error('Erro ao carregar comentários:', error)
    comments.value = []
  } finally {
    isLoadingComments.value = false
  }
}

const closeModal = () => {
  emit('close')
  comments.value = []
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      fetchComments()
    }
  },
)
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Comentários</h2>
        <button class="modal-close" @click="closeModal">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-body">
        <div v-if="isLoadingComments" class="loading">Carregando comentários...</div>

        <div v-else-if="comments.length === 0" class="no-comments">
          Nenhum comentário encontrado.
        </div>

        <div v-else class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <span class="comment-author">{{ comment.by }}</span>
              <span class="comment-date">{{ formatDate(comment.time) }}</span>
            </div>
            <div class="comment-text" v-html="comment.text"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
