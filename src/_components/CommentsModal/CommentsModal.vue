<script setup lang="ts">
import { defineEmits } from 'vue'
import { X } from 'lucide-vue-next'
import './style.css'
import CommentItem from './CommentItem.vue'
import type { Comment } from '../../_types/story'

defineProps<{
  isOpen: boolean
  rootComments: Comment[]
}>()

const emit = defineEmits<{
  close: []
}>()

const closeModal = () => {
  emit('close')
}
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
        <div v-if="!rootComments || rootComments.length === 0" class="no-comments">
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
