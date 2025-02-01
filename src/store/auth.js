// src/store/auth.js
import { createStore } from 'vuex';
import { getToken, removeToken } from '@/utils/auth';

const store = createStore({
  state: {
    token: getToken() || ''
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    removeToken(state) {
      state.token = '';
    }
  },
  actions: {
    login({ commit }, token) {
      commit('setToken', token);
    },
    logout({ commit }) {
      removeToken();
      commit('removeToken');
    }
  }
});

export default store;
