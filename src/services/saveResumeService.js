import axios from 'axios';
import {getToken} from '@/utils/auth.js';
const saveResumeService = {
  async save(fileName,resumeData) {

    const API_URL = import.meta.env.VITE_API_URL;
    const jwtToken = getToken();
    if (!jwtToken) {
      console.error('JWT token not found');
      alert('You need to Login to continue');
      return;
    }
    try {
      const response = await axios.put(`${API_URL}/save_resume`, {
        resume_title: fileName.value,  
        updated_resume: resumeData
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      if (response.status === 200) {
        return {success: true}; // 返回成功的响应
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 403:
            return { success: false, error: "API key is missing." };
          case 400:
            return { success: false, error: "Email already registered." };
          case 500:
            console.log(error.response);
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
export default saveResumeService;