import jest from 'jest-mock'

export default {
  stories: {
    fetchTopStories: jest.fn(),
    searchStories: jest.fn()
  }
}
