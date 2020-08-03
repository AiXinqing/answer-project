import axios from 'axios'

const state = {
    pageLayout: {},
    pageData: [],
    page_size: 1160
}

const mutations = {
    initPageLayout: (state, obj) => {
        state.pageLayout = obj
    },
    initPageData: (state, Arr) => {
        state.pageData.push(Arr)
    },
    amendPageData: (state, ArrItem) => {
        const index = state.pageData.findIndex((itme) => itme.id === ArrItem.id)
        state.pageData[index] = ArrItem
    },
    // pageContentFunc: (state, ArrItem) => {

    // }
}

const actions = {
    getPageData: (context) => {
        axios.get('./pageData.json')
            .then(({
                data
            }) => {
                if (data) {
                    context.commit('initPageLayout', data.pageLayout)
                    context.commit('initPageData', data.data)
                }
            })
    }
}

const getters = {
    dataLayout:(state) => {
        return state.pageLayout
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}