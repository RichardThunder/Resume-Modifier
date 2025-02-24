/*
 * @Author: Richard yuetingpei888@gmail.com
 * @Date: 2025-02-24 06:33:02
 * @LastEditors: Richard yuetingpei888@gmail.com
 * @LastEditTime: 2025-02-24 15:40:08
 * @FilePath: /Resume-Modifier/src/services/registerService.js
 * @Description: 
 * 
 */
import axios from 'axios';
export const registerService = {
  async register(email, password) {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        return { success: true, data: response.data }; // 返回成功的响应
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 403:
            return { success: false, error: "API key is missing." };
          case 400:
            return { success: false, error: "Email already registered." };
          case 500:
            return { success: false, error: "Registration failed." };
          default:
            return { success: false, error: error.response.data.error };
        }
      } else {
        return { success: false, error: 'Network error or no response from server.' };
      }
    }
  }
};