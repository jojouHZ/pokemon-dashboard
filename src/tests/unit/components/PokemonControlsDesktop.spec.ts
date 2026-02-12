import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { PokemonControlsDesktop } from '@/components/pokemon/controls'
import SearchInput from '@/components/pokemon/controls/SearchInput.vue'
import TypeFilter from '@/components/pokemon/controls/TypeFilter.vue'

describe('PokemonControlsDesktop', () => {
  const defaultProps = {
    searchQuery: '',
    selectedType: null,
    totalResults: 0,
  }

  beforeEach(() => {})

  // Smoke
  it('renders SearchInput, TypeFilter and results info', () => {
    const wrapper = mount(PokemonControlsDesktop, {
      props: defaultProps,
    })

    const searchInput = wrapper.findComponent(SearchInput)
    const typeFilter = wrapper.findComponent(TypeFilter)

    expect(searchInput.exists()).toBe(true)
    expect(typeFilter.exists()).toBe(true)

    expect(wrapper.text()).toContain('0 Pokémon available')
  })

  // SearchInput → debounced emit 'search'
  it('emits "search" when user types in SearchInput (after debounce)', async () => {
    const wrapper = mount(PokemonControlsDesktop, {
      props: defaultProps,
    })

    const searchInput = wrapper.findComponent(SearchInput)

    await searchInput.vm.$emit('update:modelValue', 'pikachu')

    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('search')).toBeFalsy()
  })

  // Type filter → emit 'filter'
  it('emits "filter" when user selects a type in TypeFilter', async () => {
    const wrapper = mount(PokemonControlsDesktop, {
      props: defaultProps,
    })

    const typeFilter = wrapper.findComponent(TypeFilter)

    await typeFilter.vm.$emit('update:modelValue', 'fire')

    expect(wrapper.emitted('filter')).toBeTruthy()
    expect(wrapper.emitted('filter')?.[0]).toEqual(['fire'])
  })

  // Clear Filters -> emit 'clear'
  it('shows Clear Filters button when filters are active and emits "clear" on click', async () => {
    const wrapper = mount(PokemonControlsDesktop, {
      props: {
        searchQuery: 'char',
        selectedType: 'fire',
        totalResults: 10,
      },
    })

    const clearButton = wrapper.find('.pokemon-controls-desktop__clear-btn')
    expect(clearButton.exists()).toBe(true)
    expect(clearButton.text()).toContain('Clear Filters')

    await clearButton.trigger('click')

    expect(wrapper.emitted('clear')).toBeTruthy()
    expect(wrapper.emitted('clear')?.length).toBe(1)
  })

  // Show totalResults
  it('displays correct totalResults text', () => {
    const wrapper = mount(PokemonControlsDesktop, {
      props: {
        searchQuery: '',
        selectedType: null,
        totalResults: 42,
      },
    })

    expect(wrapper.text()).toContain('42 Pokémon available')
  })
})
