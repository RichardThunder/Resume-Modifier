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

const API_URL = import.meta.env.VITE_API_URL;
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: email.trim(),
      password: password,
    }, {headers: {
      'Content-Type': 'application/json'
    }}
    );
    if(response.status === 200){
      return {
        token: response.data.token,
        success: true,
        email:response.data.user.email
      }
    }
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return { success: false, error: "Invalid email or password" };
        case 400:
          return { success: false, error: "Email and password required." };
        default:
          return { success: false, error: error.response.data.error };
      }
    } else {
      return { success: false, error: 'Network error or no response from server.' };
    }
  }
};
