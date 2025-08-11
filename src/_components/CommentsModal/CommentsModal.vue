<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import './style.css'
import CommentItem from './CommentItem.vue'
import { computed } from 'vue'

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

const rootComments = computed(() => {
  const allKids = new Set<number>()
  comments.value.forEach((c) => {
    c.kids?.forEach((kid) => allKids.add(kid))
  })
  return comments.value.filter((c) => !allKids.has(c.id))
})

const fetchComments = async () => {
  if (!props.storyId) return

  isLoadingComments.value = true

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/hackernews/${props.storyId}/relevant_comments`,
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
        <div
          v-if="isLoadingComments"
          class="loading"
          style="display: flex; align-items: center; gap: 8px"
        >
          <Loader2 :size="20" class="animate-spin" />
          Carregando comentários...
        </div>

        <div v-else-if="comments.length === 0" class="no-comments">
          Nenhum comentário encontrado.
        </div>

        <div v-else class="comments-list">
          <CommentItem
            v-for="comment in rootComments"
            :key="comment.id"
            :comment="comment"
            :level="0"
          />
        </div>
      </div>
    </div>
  </div>
</template>
