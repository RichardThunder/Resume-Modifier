/*
 * @Author: Richard yuetingpei888@gmail.com
 * @Date: 2025-02-26 18:28:48
 * @LastEditors: Richard yuetingpei888@gmail.com
 * @LastEditTime: 2025-02-27 05:23:05
 * @FilePath: /Resume-Modifier/src/services/feedbackService.js
 * @Description: 
 * 
 */
import {getToken} from "@/utils/auth.js";
import axios from "axios";
import router from "@/router/index.js";

const feedbackService = {
    sendFeedback: async (sectionData, section_type, feedback, updated_resume) => {
        let obj;
        if(section_type === "summary") {
            obj = {
                section:{
                    sectionType: section_type,
                    summary: sectionData
                },
                feedback: feedback,
                updated_resume: updated_resume,
            };
        }else{
            obj = {section:{
                    section_type: section_type,
                    ...sectionData
                },
                feedback: feedback,
                updated_resume: updated_resume,
                }
        }
        console.log("Sending feedback...",obj);
        try {
        const API_URL = import.meta.env.VITE_API_URL;
        const jwtToken = getToken();
        if (!jwtToken) {
            alert('You need to Login to continue');
            await router.push({name: 'Login'});
            return;
        }

            const response = await axios.put(
                `${API_URL}/feedback`,
                obj,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });
            if (response.data.status === 200) {
                const content = response.data.data.content;
                return {success: true, content};
            } else {
                return {success: false, error: response.data.message};
            }
        } catch (err) {
            console.error(err);
            return {success: false, error: err.message};
        }
    }
}
export default feedbackService;