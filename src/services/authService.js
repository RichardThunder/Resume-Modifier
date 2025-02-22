/*
 * @Author: Richard yuetingpei888@gmail.com
 * @Date: 2025-01-31 22:43:09
 * @LastEditors: Richard yuetingpei888@gmail.com
 * @LastEditTime: 2025-01-31 23:11:45
 * @FilePath: /Resume-Modifier/src/services/authService.js
 * @Description:
 *
 */
import axios from "axios";

const API_URL = import.meta.env.API_URL;

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: email.trim(),
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error(`Error login: ${error.response.data}`);
  }
};
