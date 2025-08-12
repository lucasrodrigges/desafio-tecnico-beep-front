import { jest, expect } from '@jest/globals'
import { mount, VueWrapper } from '@vue/test-utils'
jest.mock('../../../_api', () => ({
  default: {
    stories: {
      fetchTopStories: jest.fn(),
      searchStories: jest.fn()
    }
  }
}))

import CommentsModal from '../CommentsModal.vue'

const mockComments = [
  {
    id: 1,
    by: 'Usuário',
    text: 'Comentário 1',
    time: 1234567890,
    type: 'comment'
  }
]

describe('CommentsModal.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof CommentsModal>>

  beforeEach(() => {
    wrapper = mount(CommentsModal, {
      props: {
        isOpen: true,
        rootComments: mockComments
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renderiza o modal quando isOpen é true', () => {
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.find('.modal-title').text()).toBe('Comentários')
  })

  it('não renderiza o modal quando isOpen é false', () => {
    wrapper.unmount()
    wrapper = mount(CommentsModal, {
      props: {
        isOpen: false,
        rootComments: mockComments
      }
    })
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('exibe mensagem quando não há comentários', () => {
    wrapper.unmount()
    wrapper = mount(CommentsModal, {
      props: {
        isOpen: true,
        rootComments: []
      }
    })
    expect(wrapper.text()).toContain('Nenhum comentário encontrado.')
  })

  it('emite close ao clicar fora do conteúdo', async () => {
    await wrapper.find('.modal-overlay').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('emite close ao clicar no botão de fechar', async () => {
    await wrapper.find('.modal-close').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('close')
  })
})
