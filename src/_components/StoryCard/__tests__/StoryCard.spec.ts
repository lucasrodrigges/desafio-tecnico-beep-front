import { jest, expect } from '@jest/globals'
import { mount, VueWrapper } from '@vue/test-utils'
import StoryCard from '../StoryCard.vue'
import type { Story } from '../../../_types/story'

jest.mock('../../../_api', () => ({
  default: {
    stories: {
      fetchTopStories: jest.fn<() => Promise<import('../../../_types/story').Story[]>>(),
      searchStories: jest.fn<(query: string) => Promise<import('../../../_types/story').Story[]>>()
    }
  }
}))


const CommentsModalStub = {
  template: '<div data-testid="comments-modal" v-if="isOpen"></div>',
  props: ['isOpen', 'rootComments']
}

describe('StoryCard.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof StoryCard>>
  const story: Story = {
    by: 'Autor Teste',
    descendants: 2,
    id: 1,
    score: 42,
    time: 1234567890,
    title: 'Título de Teste',
    type: 'story',
    url: 'https://exemplo.com',
    comments: [
      {
        by: 'Comentador',
        id: 101,
        text: 'Comentário de teste',
        time: 1234567891,
        type: 'comment'
      }
    ]
  }

  beforeEach(() => {
    wrapper = mount(StoryCard, {
      props: { ...story },
      global: {
        stubs: {
          CommentsModal: CommentsModalStub
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renderiza os dados principais corretamente', () => {
    expect(wrapper.text()).toContain(story.by)
    expect(wrapper.text()).toContain(`${story.score} pontos`)
    expect(wrapper.text()).toContain(story.title)
    expect(wrapper.find('a').attributes('href')).toBe(story.url)
  })

  it('exibe o número de comentários quando há comentários', () => {
    expect(wrapper.text()).toContain('1 comentários')
    expect(wrapper.find('.comments').exists()).toBe(true)
  })

  it('não exibe comentários se não houver', () => {
    wrapper.unmount()
    wrapper = mount(StoryCard, {
      props: { ...story, comments: [] },
      global: {
        stubs: {
          CommentsModal: CommentsModalStub
        }
      }
    })
    expect(wrapper.find('.comments').exists()).toBe(false)
  })

  it('abre o modal ao clicar nos comentários', async () => {
    const commentsDiv = wrapper.find('.comments-clickable')
    expect(wrapper.find('[data-testid="comments-modal"]').exists()).toBe(false)
    await commentsDiv.trigger('click')
    expect(wrapper.find('[data-testid="comments-modal"]').exists()).toBe(true)
  })

  it('não abre o modal se não houver comentários', async () => {
    wrapper.unmount()
    wrapper = mount(StoryCard, {
      props: { ...story, comments: [] },
      global: {
        stubs: {
          CommentsModal: CommentsModalStub
        }
      }
    })
    const commentsDiv = wrapper.find('.comments-clickable')
    expect(commentsDiv.exists()).toBe(false)
  })
})
