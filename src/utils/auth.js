/*
 * @Author: Richard yuetingpei888@gmail.com
 * @Date: 2025-01-31 22:43:23
 * @LastEditors: Richard yuetingpei888@gmail.com
 * @LastEditTime: 2025-01-31 23:28:32
 * @FilePath: /Resume-Modifier/src/utils/auth.js
 * @Description:
 *
 */
import {tr} from 'vuetify/locale';

export const getToken = () => {
  return localStorage.getItem("jwt_token");
};

export const setToken = (token) => {
  localStorage.setItem("jwt_token", token);
};

export const removeToken = () => {
  localStorage.removeItem("jwt_token");
};

export const isAuthenticated = () => {
  return true;
  // return !!getToken();
};
