import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { PokemonControlsMobile } from '@/components/pokemon/controls'
import SearchInput from '@/components/pokemon/controls/SearchInput.vue'
import TypeFilterMobile from '@/components/pokemon/controls/mobile/TypeFilterMobile.vue'

describe('PokemonControlsDesktop', () => {
  const defaultProps = {
    searchQuery: '',
    selectedTypes: [],
    isAllActive: true,
    totalResults: 0,
  }

  beforeEach(() => {})

  // Smoke
  it('renders SearchInput, TypeFilter and results info', () => {
    const wrapper = mount(PokemonControlsMobile, {
      props: defaultProps,
    })

    const searchInput = wrapper.findComponent(SearchInput)
    const typeFilter = wrapper.findComponent(TypeFilterMobile)

    expect(searchInput.exists()).toBe(true)
    expect(typeFilter.exists()).toBe(true)
  })

  // SearchInput → debounced emit 'search'
  it('emits "search" when user types in SearchInput (after debounce)', async () => {
    const wrapper = mount(PokemonControlsMobile, {
      props: defaultProps,
    })

    const searchInput = wrapper.findComponent(SearchInput)

    await searchInput.vm.$emit('update:modelValue', 'pikachu')

    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('search')).toBeFalsy()
  })

  // Type filter → emit 'filter'
  it('emits "filter" when user selects a type in TypeFilter', async () => {
    const wrapper = mount(PokemonControlsMobile, {
      props: defaultProps,
    })

    const typeFilter = wrapper.findComponent(TypeFilterMobile)

    await typeFilter.vm.$emit('toggle-type', 'fire')

    expect(wrapper.emitted('toggle-type')).toBeTruthy()
    expect(wrapper.emitted('toggle-type')?.[0]).toEqual(['fire'])
  })

  // Clear Filters -> emit 'clear'
  it('shows Clear Filters button when filters are active and emits "clear" on click', async () => {
    const wrapper = mount(PokemonControlsMobile, {
      props: {
        searchQuery: 'char',
        selectedTypes: ['fire'],
        isAllActive: false,
        totalResults: 10,
      },
    })

    const clearButton = wrapper.find('.pokemon-controls-mobile__clear-btn')
    expect(clearButton.exists()).toBe(true)
    expect(clearButton.text()).toContain('✕')

    await clearButton.trigger('click')

    expect(wrapper.emitted('clear')).toBeTruthy()
    expect(wrapper.emitted('clear')?.length).toBe(1)
  })
})
