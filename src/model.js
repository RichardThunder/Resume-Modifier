import {reactive, ref} from 'vue';
//solution: use model.js to model shared data
//https://cn.vuejs.org/guide/scaling-up/state-management#%E4%BB%8E%E9%9B%B6%E6%89%93%E9%80%A0%E7%AE%80%E5%8D%95%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86
export const model = reactive({
  userInfo: {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+123456789',
    email: 'johndoe@example.com',
    headLine: 'Software Engineer',
    linkedInURL: 'https://www.linkedin.com/in/johndoe',
    country: 'China',
    city: 'Beijing',
    websiteOrOtherProfileURL: 'https://johndoe.com'
  },
  summary: 'Experienced software engineer...',
  workExperience: [
    {
      city: 'New York',
      companyName: 'TechCorp',
      country: 'USA',
      description: 'Developed backend services and APIs for enterprise-level applications.',
      fromDate: '2020-01-01',
      isPresent: false,
      jobTitle: 'Software Engineer',
      toDate: '2023-12-31',
      score:100,
      suggestion:"Well Done"
    },
    {
      city: 'New York',
      companyName: 'TechCorp',
      country: 'USA',
      description: 'Developed backend services and APIs for enterprise-level applications.',
      fromDate: '2020-01-01',
      isPresent: false,
      jobTitle: 'Software Engineer',
      toDate: '2023-12-31',
      score:80,
      suggestion:"need more detail in description"
    },
    {
      city: 'San Francisco',
      companyName: 'DevWorks',
      country: 'USA',
      description: 'Worked on front-end development and UI design for client projects.',
      fromDate: '2018-06-01',
      isPresent: false,
      jobTitle: 'Junior Developer',
      toDate: '2019-12-31',
      score: 60,
      suggestion:"need further more detail in description"
    },
    {
      city: 'San Francisco',
      companyName: 'DevWorks',
      country: 'USA',
      description: 'Worked on front-end development and UI design for client projects.',
      fromDate: '2018-06-01',
      isPresent: false,
      jobTitle: 'Junior Developer',
      toDate: '2019-12-31',
      score: 40,
      suggestion:"need further more detail in description"
    },
    {
      city: 'San Francisco',
      companyName: 'DevWorks',
      country: 'USA',
      description: 'Worked on front-end development and UI design for client projects.',
      fromDate: '2018-06-01',
      isPresent: false,
      jobTitle: 'Junior Developer',
      toDate: '2019-12-31',
      score: 20,
      suggestion:"need further more detail in description"
    },
    {
      city: 'San Francisco',
      companyName: 'DevWorks',
      country: 'USA',
      description: 'Worked on front-end development and UI design for client projects.',
      fromDate: '2018-06-01',
      isPresent: false,
      jobTitle: 'Junior Developer',
      toDate: '2019-12-31',
      score: 0,
      suggestion:"need further more detail in description"
    }
    ],
  education: [
    {
      city: 'Chongqing',
      country: 'China',
      degree: 'Bachelor\'s',
      description: 'Graduated with honors, specializing in web development.',
      fieldOfStudy: 'Software Engineering',
      fromDate: '2014-09-01',
      grade: 'A',
      institutionName: 'Chongqing University',
      isPresent: false,
      toDate: '2018-06-30'
    },
    {
      city: 'Cambridge',
      country: 'USA',
      degree: 'Master\'s',
      description: 'Focused on machine learning and AI research.',
      fieldOfStudy: 'Computer Science',
      fromDate: '2019-09-01',
      grade: 'A+',
      institutionName: 'MIT',
      isPresent: false,
      toDate: '2021-06-30'
    }
  ],
  skills: ['Java', 'Python', 'JavaScript'],
  achievements: 'Developed an award-winning application for e-commerce...',
  project: [
    {
      city: 'Shanghai',
      country: 'China',
      description: 'Led the development of a scalable inventory management system for a retail client.',
      fromDate: '2022-01-01',
      isPresent: false,
      projectRole: 'Lead Developer',
      title: 'Inventory Management System',
      toDate: '2022-12-31'
    },
    {
      city: 'Boston',
      country: 'USA',
      description: 'Developed machine learning models for predicting sales trends in e-commerce.',
      fromDate: '2020-06-01',
      isPresent: false,
      projectRole: 'Researcher',
      title: 'Machine Learning Algorithm for Predictive Analytics',
      toDate: '2021-06-30'
    }
  ],
  award: [
    {
      dateOfAward: '2021-12-15',
      description: 'Awarded for outstanding contributions to the company\'s development team.',
      issuer: 'TechCorp',
      name: 'Best Software Engineer of the Year',
      urlToAward: 'https://www.techcorp.com/awards/best-software-engineer-2021'
    }
  ],
  certifications: [
    {
      date: '2020-08-01',
      description: 'Certified Java Developer after completing the official Oracle certification program.',
      expiryDate: '2023-08-01',
      issuer: 'Oracle',
      name: 'Oracle Certified Java Developer',
      url: 'https://www.oracle.com/certifications/java-developer'
    },
    {
      date: '2019-04-15',
      description: 'Certified Scrum Master after successful completion of Scrum Master training.',
      expiryDate: '2024-04-15',
      issuer: 'Scrum Alliance',
      name: 'Certified Scrum Master',
      url: 'https://www.scrumalliance.org/certifications/scrum-master'
    }
  ],
  publications: [
    {
      date: '2021-07-01',
      name: 'AI in Business',
      publisher: 'Tech Journal',
      url: 'https://www.techjournal.com/ai-in-business'
    },
    {
      date: '2020-11-20',
      name: 'The Future of Cloud Computing',
      publisher: 'CloudTech',
      url: 'https://www.cloudtech.com/future-of-cloud-computing'
    }
  ],
  volunteering: [
    {
      city: 'San Francisco',
      country: 'USA',
      description: 'Provided tech support to local community centers and non-profits.',
      fromDate: '2021-03-01',
      name: 'Community Tech Support',
      role: 'Volunteer Developer',
      toDate: '2021-12-31'
    },
    {
      city: 'Chongqing',
      country: 'China',
      description: 'Taught coding to underprivileged youth in the community.',
      fromDate: '2019-07-01',
      name: 'Youth Coding Workshops',
      role: 'Instructor',
      toDate: '2019-12-31'
    }
  ],
  references: [
    {
      company: 'TechCorp',
      description: 'Jane Smith was my supervisor at TechCorp, and she can provide detailed feedback on my work performance.',
      email: 'janesmith@techcorp.com',
      personName: 'Jane Smith',
      phoneNumber: '+123456789',
      roleOfPerson: 'HR Manager'
    },
    {
      company: 'DevWorks',
      description: 'Tom Brown was my team lead at DevWorks and can speak to my contributions to the team.',
      email: 'tombrown@devworks.com',
      personName: 'Tom Brown',
      phoneNumber: '+987654321',
      roleOfPerson: 'Team Lead'
    }
  ]
});
export const analysis = reactive({
      'overallAnalysis': {
        'comment': 'very good',
        'score': 90
      },
      'workExperience': [
        {
          'companyName': '',
          'jobTitle': '',
          'comment': '',
          'score': 0
        }
      ],
      'education': [
        {
          'institutionName': '',
          'degree': '',
          'comment': '',
          'score': 0
        }
      ],
      'achievements': {
        'comment': '',
        'score': 0
      },
      'project': [
        {
          'title': '',
          'comment': '',
          'score': 0
        }
      ]

    }
);
export const fileName = ref('resume.pdf');

/*
export const scoreToColors = function (score) {
  if (score < 0 || score > 100) {
    throw new Error('Score must be between 0 and 100');
  }

  // 将分数映射到 0-255 的范围，用于颜色分量
  const red = Math.round(255 - (score * 2.55));
  const green = Math.round(score * 2.55);

  // 返回颜色字符串
  return `rgb(${red}, ${green}, 0)`;
}
*/
export const  scoreToColors= (score)=> {
  if (score < 0 || score > 100) {
    throw new Error('Score must be between 0 and 100');
  }

  // 定义各个颜色的 RGB 值
  const deepRed = { r: 139, g: 0, b: 0 };       // 深红色
  const red = { r: 255, g: 0, b: 0 };           // 红色
  const yellow = { r: 255, g: 255, b: 0 };      // 黄色
  const lightGreen = { r: 0, g: 255, b: 0 };    // 浅绿色
  const deepGreen = { r: 0, g: 100, b: 0 };     // 深绿色

  let redVal, greenVal, blueVal;

  // 映射分为 4 个区间：0-25、25-50、50-75、75-100
  if (score <= 25) {
    // 从深红色到红色
    redVal = Math.round(deepRed.r + (red.r - deepRed.r) * (score / 25));
    greenVal = Math.round(deepRed.g + (red.g - deepRed.g) * (score / 25));
    blueVal = Math.round(deepRed.b + (red.b - deepRed.b) * (score / 25));
  } else if (score <= 50) {
    // 从红色到黄色
    const adjustedScore = score - 25; // 将区间缩小到 [0, 25]
    redVal = Math.round(red.r + (yellow.r - red.r) * (adjustedScore / 25));
    greenVal = Math.round(red.g + (yellow.g - red.g) * (adjustedScore / 25));
    blueVal = Math.round(red.b + (yellow.b - red.b) * (adjustedScore / 25));
  } else if (score <= 75) {
    // 从黄色到浅绿色
    const adjustedScore = score - 50; // 将区间缩小到 [0, 25]
    redVal = Math.round(yellow.r + (lightGreen.r - yellow.r) * (adjustedScore / 25));
    greenVal = Math.round(yellow.g + (lightGreen.g - yellow.g) * (adjustedScore / 25));
    blueVal = Math.round(yellow.b + (lightGreen.b - yellow.b) * (adjustedScore / 25));
  } else {
    // 从浅绿色到深绿色
    const adjustedScore = score - 75; // 将区间缩小到 [0, 25]
    redVal = Math.round(lightGreen.r + (deepGreen.r - lightGreen.r) * (adjustedScore / 25));
    greenVal = Math.round(lightGreen.g + (deepGreen.g - lightGreen.g) * (adjustedScore / 25));
    blueVal = Math.round(lightGreen.b + (deepGreen.b - lightGreen.b) * (adjustedScore / 25));
  }

  // 返回 RGB 颜色字符串
  return `rgb(${redVal}, ${greenVal}, ${blueVal})`;
}
