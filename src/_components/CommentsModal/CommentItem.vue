<script setup lang="ts">
import { ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'

interface Comment {
  id: number
  by: string
  text: string
  time: number
  kids?: number[]
}

const props = defineProps<{
  comment: Comment
  level?: number
}>()

const showReplies = ref(false)
const isLoadingReplies = ref(false)
const replies = ref<Comment[]>([])

const hasReplies = props.comment.kids && props.comment.kids.length > 0

const fetchReplies = async () => {
  if (!props.comment.kids || props.comment.kids.length === 0) return
  isLoadingReplies.value = true
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/hackernews/replies_at_comments?ids=${encodeURIComponent(props.comment.kids.join(','))}`,
    )
    const data = await response.json()
    console.log({ data })

    replies.value = data
  } catch (error) {
    replies.value = []
  } finally {
    isLoadingReplies.value = false
  }
}

const toggleReplies = async () => {
  if (!showReplies.value && replies.value.length === 0) {
    await fetchReplies()
  }
  showReplies.value = !showReplies.value
}
</script>

<template>
  <div class="comment-item" :style="{ marginLeft: (props.level || 0) * 20 + 'px' }">
    <div class="comment-header">
      <span class="comment-author">{{ props.comment.by }}</span>
      <span class="comment-date">{{
        new Date(props.comment.time * 1000).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      }}</span>
    </div>
    <div class="comment-text" v-html="props.comment.text"></div>
    <div v-if="hasReplies" class="comment-replies-toggle">
      <button @click="toggleReplies" class="see-replies-btn">
        {{ showReplies ? 'Esconder respostas' : 'Ver respostas' }}
      </button>
    </div>
    <div v-if="showReplies" class="comment-replies">
      <div
        v-if="isLoadingReplies"
        class="loading"
        style="display: flex; align-items: center; gap: 8px"
      >
        <Loader2 :size="18" class="animate-spin" />
        Carregando respostas...
      </div>
      <CommentItem
        v-for="reply in replies"
        :key="reply.id"
        :comment="reply"
        :level="(props.level || 0) + 1"
      />
    </div>
  </div>
</template>
