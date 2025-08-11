import { jest, expect } from '@jest/globals'
import { mount, flushPromises } from '@vue/test-utils'

jest.mock('../_api', () => ({
  default: {
    stories: {
      fetchTopStories: jest.fn<() => Promise<import('../_types/story').Story[]>>().mockResolvedValue([
        { id: 1, by: 'Autor', score: 10, title: 'Story 1', descendants: 0, time: 0, type: 'story' }
      ]),
      searchStories: jest.fn<(query: string) => Promise<import('../_types/story').Story[]>>().mockResolvedValue([
        { id: 2, by: 'Outro', score: 5, title: 'Story 2', descendants: 0, time: 0, type: 'story' }
      ])
    }
  }
}))

jest.mock('@rails/actioncable', () => ({
  createConsumer: () => ({
    subscriptions: {
      create: (
        _params: Record<string, unknown>,
        callbacks: { connected: () => void }
      ) => {
        setTimeout(() => callbacks.connected(), 10)
        return {
          unsubscribe: () => {}
        }
      }
    },
    disconnect: () => {}
  })
}))

import App from '../App.vue'

const StoryCardStub = {
  template: '<li class="story-card-stub"></li>',
  props: ['by', 'score', 'title', 'descendants', 'time', 'type', 'id']
}

describe('App.vue', () => {
  it('renderiza o estado de carregamento', async () => {
    const wrapper = mount(App, {
      global: {
        stubs: { StoryCard: StoryCardStub }
      }
    })
    expect(wrapper.html()).toContain('Carregando...')
    await flushPromises()
    wrapper.unmount()
  })

  it('renderiza stories após carregamento', async () => {
    const wrapper = mount(App, {
      global: {
        stubs: { StoryCard: StoryCardStub }
      }
    })
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.findAll('.story-card-stub').length).toBe(1)
    wrapper.unmount()
  })

  it('realiza busca e exibe resultados', async () => {
    const wrapper = mount(App, {
      global: {
        stubs: { StoryCard: StoryCardStub }
      }
    })
    await flushPromises()
    const input = wrapper.find('input[type="text"]')
    await input.setValue('busca')
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.findAll('.story-card-stub').length).toBe(1)
    wrapper.unmount()
  })
})
