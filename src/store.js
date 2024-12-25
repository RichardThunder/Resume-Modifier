import {reactive} from 'vue';
//solution: use store.js to store shared data
//https://cn.vuejs.org/guide/scaling-up/state-management#%E4%BB%8E%E9%9B%B6%E6%89%93%E9%80%A0%E7%AE%80%E5%8D%95%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86
export const store = reactive({
  userInfo: {
    firstName: 'li',
    lastName: '',
    phoneNumber: '',
    email: '',
    headLine: '',
    linkedInURL: '',
    country:'',
    city:'',
    websiteOrOtherProfileURL: ''
  },
  summary: '',
  workExperience: [],
  education: [],
  skills: [],
  achievements: '',
  projects: [],
  award: [],
  certifications: [],
  publications: [],
  volunteering: [],
  references: []

});