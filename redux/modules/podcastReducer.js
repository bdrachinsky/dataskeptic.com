const LOAD_EPISODES = 'LOAD_EPISODES'
const LOAD_EPISODES_SUCCESS = 'LOAD_EPISODES_SUCCESS'
const LOAD_EPISODES_FAIL = 'LOAD_EPISODES_FAIL'
const SET_ACTIVE_YEAR = 'SET_ACTIVE_YEAR'
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE'

const LOAD_YEARS = 'LOAD_YEARS'
const LOAD_YEARS_SUCCESS = 'LOAD_YEARS_SUCCESS'
const LOAD_YEARS_FAIL = 'LOAD_YEARS_FAIL'

const LOAD_EPISODE = 'LOAD_EPISODE'
const LOAD_EPISODE_SUCCESS = 'LOAD_EPISODE_SUCCESS'
const LOAD_EPISODE_FAIL = 'LOAD_EPISODE_FAIL'

const initialState = {
    loading: false,
    needReload: false,
    error: false,
    episodes: null,
    single: null,
    years: null,
    activeYear: null,
    total: null,
    perPage: 10,
    currentPage: null,
    lastPage: null,
    from: null,
    to: null
}

export default function reducer(state = initialState,
                                action = {}) {
    switch (action.type) {
        case LOAD_EPISODES:
            return {
                ...state,
                episodes: [],
                loading: true,
                needReload: false
            }
        case LOAD_EPISODES_SUCCESS:
            return {
                ...state,
                episodes: action.result.episodes,
                loading: false,
                total: action.result.total,
                currentPage: action.result.currentPage,
                lastPage: action.result.lastPage,
                from: action.result.from,
                to: action.result.to
            }
        case LOAD_EPISODE:
            return {
                ...state,
                loading: true
            }
        case LOAD_EPISODE_SUCCESS:
            return {
                ...state,
                single: action.result
            }
        case LOAD_YEARS:
            return {
                ...state,
                loading: true
            }
        case LOAD_YEARS_SUCCESS:
            return {
                ...state,
                years: action.result
            }
        case SET_ACTIVE_YEAR:
            return {
                ...state,
                needReload: true,
                activeYear: action.payload.selectedYear
            }
        case SET_CURRENT_PAGE:
            return {
                ...state,
                needReload: true,
                currentPage: action.payload.page
            }
        default:
            return state
    }
}

const fetchEpisodesUrl = (year, page) =>
    (year)
        ? `/episodes/${year}/${page}`
        : `/episodes/${page}`

export const loadEpisodesList = (year, page) => ({
    types: [LOAD_EPISODES, LOAD_EPISODES_SUCCESS, LOAD_EPISODES_FAIL],
    promise: client => client.get(fetchEpisodesUrl(year, page))
})

export const loadSingleEpisode = pn => ({
    types: [LOAD_EPISODE, LOAD_EPISODE_SUCCESS, LOAD_EPISODE_FAIL],
    promise: client => client.get(`/episodes/${pn}`)
})

export const loadYears = () => ({
    types: [LOAD_YEARS, LOAD_YEARS_SUCCESS, LOAD_YEARS_FAIL],
    promise: client => client.get(`/episodes/years`)
})

export const setActiveYear = selectedYear => ({
    type: SET_ACTIVE_YEAR,
    payload: {
        selectedYear
    }
})

export const setCurrentPage = page => ({
    type: SET_CURRENT_PAGE,
    payload: {
        page
    }
})

//Selectors
export const getEpisodes = state => state.podcasts && state.podcasts.episodes

export const getSingle = state => state.podcasts && state.podcasts.single

export const getActiveYear = state => state.podcasts && state.podcasts.activeYear

export const getYears = state => state.podcasts && state.podcasts.years

export const getPageCount = state => state.podcasts && state.podcasts.lastPage

export const getPage = state => state.podcasts && state.podcasts.currentPage

export const getNeedReload = state => state.podcasts && state.podcasts.needReload


//Helpers
export const hasEpisodes = state => state.podcasts && !!state.podcasts.episodes

export const hasYears = state => state.podcasts && !!state.podcasts.years