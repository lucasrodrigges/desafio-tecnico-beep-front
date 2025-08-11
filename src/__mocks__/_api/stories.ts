import jest from 'jest-mock'

export const fetchTopStories = jest.fn()
export const searchStories = jest.fn()

export default {
  fetchTopStories,
  searchStories
}
