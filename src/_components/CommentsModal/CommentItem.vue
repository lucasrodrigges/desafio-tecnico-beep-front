<script setup lang="ts">
import { ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import _api from '../../_api'
import type { Comment } from '../../_types/story'

const props = defineProps<{
  comment: Comment
  level?: number
}>()

const showReplies = ref(false)
const isLoadingReplies = ref(false)
const replies = ref<Comment[]>([])

const hasReplies = props.comment.kids && props.comment.kids.length > 0

const currentLevel = props.level || 0
const maxNestingLevel = 4
const nextLevel = currentLevel + 1

const fetchReplies = async () => {
  if (!props.comment.kids || props.comment.kids.length === 0) return

  isLoadingReplies.value = true
  replies.value = await _api.stories.fetchRepliesAtComments(props.comment.kids)
  isLoadingReplies.value = false
}

const toggleReplies = async () => {
  if (!showReplies.value && replies.value.length === 0) {
    await fetchReplies()
  }
  showReplies.value = !showReplies.value
}
</script>

<template>
  <div class="comment-item" :class="`comment-level-${Math.min(currentLevel, 3)}`">
    <div class="comment-header">
      <span class="comment-author">{{ props.comment.by }}</span>
      <span class="comment-date">{{
        new Date(props.comment.time * 1000).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      }}</span>
    </div>
    <div class="comment-text" v-html="props.comment.text"></div>
    <div v-if="hasReplies" class="comment-replies-toggle">
      <button @click="toggleReplies" class="see-replies-btn" :disabled="isLoadingReplies">
        {{
          isLoadingReplies ? 'Carregando...' : showReplies ? 'Esconder respostas' : 'Ver respostas'
        }}
      </button>
    </div>
    <div v-if="showReplies" class="comment-replies">
      <div v-if="isLoadingReplies" class="loading-replies">
        <Loader2 :size="16" class="animate-spin" />
        <span>Carregando respostas...</span>
      </div>
      <CommentItem v-for="reply in replies" :key="reply.id" :comment="reply" :level="nextLevel" />
    </div>
  </div>
</template>
