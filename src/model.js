import {reactive, ref} from 'vue';

export const model = reactive({
  achievements: [],
  award: [],
  certifications: [],
  education: [],
  project: [],
  publications: [],
  references: [],
  skills: [],
  summary: "",
  userInfo: {
  },
  volunteering: [],
  workExperience: []
});
export const modelClear = reactive({
  achievements: [],
  award: [],
  certifications: [],
  education: [],
  project: [],
  publications: [],
  references: [],
  skills: [],
  summary: "",
  userInfo: {
    firstName: '',
    lastName: '',
  },
  volunteering: [],
  workExperience: []
})

export const analysis = reactive({
      achievements: {
        // comment: 'The resume lacks specific achievements or awards related to the required technologies (Python, Flask) for the job.',
        // score: 50
      },
      education: [
        {
          // comment: 'A Master\'s degree in Computer Science provides a strong foundation for software engineering, although the resume does not specify courses related to Python or Flask.',
          // degree: 'M.S.',
          // institutionName: 'UNIVERSITY OF ARIZONA',
          // score: 80
        }
      ],
      overallAnalysis: {
        // comment: 'The candidate has a solid background in software engineering, with strong experience in Java and JavaScript frameworks, as well as significant experience with Docker. However, the resume does not mention Python or Flask, which are key requirements for the job. The candidate has experience with RESTful APIs and some cloud deployment tools, but lacks direct experience with the desired technologies.',
        // score: 50
      },
      project: [
        {
          // comment: 'This project showcases the candidate\'s ability to use Docker and build RESTful APIs, which are relevant skills. However, there is no indication of Python or Flask usage.',
          // score: 70,
          // title: 'PicoShell'
        }

      ],
      workExperience: [
        {
          // comment: 'The candidate has demonstrated strong skills in application development and optimization, with a focus on Java and SQL. They have experience with RESTful APIs, which is relevant, and have worked on large-scale applications. However, there is no mention of Python or Flask experience.',
          // companyName: 'WALMART, INC.',
          // jobTitle: 'Programmer Analyst, Call Center Engineering Team',
          // score: 60
        }
      ],
      award: [],
      certifications: [],
      publications: [],
      volunteering: [],
      references: []
    }
);
export const fileName = ref('resume.pdf');

export const data = reactive({
  feedback: '',
  section: ''
});

export const modelExample = reactive({
  achievements: [
    'Successfully led a team of 5 developers to deliver a critical project 2 weeks ahead of schedule.',
    'Reduced application latency by 40% through performance optimization techniques.',
    'Received the "Innovation Award" for developing a novel solution to a complex problem.',
    'Mentored junior developers, improving their skills and contributing to team growth.',
  ],
  award: [
    {
      name: 'Employee of the Month',
      issuer: 'Acme Corp',
      urlToAward: 'https://www.example.com/award1',
      dateOfAward: '2023-05-15',
      description: 'Recognized for outstanding contributions to the team and exceeding performance goals.',
    },
    {
      name: 'Innovation Award',
      issuer: 'Tech Solutions Inc.',
      urlToAward: 'https://www.example.com/award2',
      dateOfAward: '2024-01-20',
      description: 'Awarded for developing a novel solution that significantly improved efficiency and reduced costs.',
    },
  ],
  certifications: [
    {
      name: 'Certified Scrum Master (CSM)',
      issuer: 'Scrum Alliance',
      date: '2022-08-01',
      expiryDate: '2024-08-01',
      url: 'https://www.example.com/csm',
      description: 'Demonstrates proficiency in Scrum principles and practices.',
    },
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services (AWS)',
      date: '2023-03-10',
      expiryDate: '2026-03-10',
      url: 'https://www.example.com/aws-ccp',
      description: 'Validates foundational knowledge of AWS Cloud concepts and services.',
    },
  ],
  education: [
    {
      city: 'Tucson',
      country: 'Arizona',
      degree: 'M.S.',
      description: 'Specialized in data mining and machine learning. Conducted research on recommendation systems.',
      fieldOfStudy: 'Computer Science',
      fromDate: '2011-08-01',
      grade: '3.8/4.0',
      institutionName: 'UNIVERSITY OF ARIZONA',
      isPresent: false,
      toDate: '2012-05-01'
    },
    {
      city: 'Tucson',
      country: 'Arizona',
      degree: 'B.S.B.A.',
      description: 'Focused on database management and business intelligence.',
      fieldOfStudy: 'Management Information Systems',
      fromDate: '2007-08-01',
      grade: '3.5/4.0',
      institutionName: 'UNIVERSITY OF ARIZONA',
      isPresent: false,
      toDate: '2011-05-01'
    },
    {
      city: 'Online',
      country: 'Coursera',
      degree: 'Machine Learning Specialization',
      description: 'Completed a specialization in Machine Learning, covering topics such as supervised learning, unsupervised learning, and deep learning.',
      fieldOfStudy: 'Machine Learning',
      fromDate: '2023-01-01',
      grade: 'N/A',
      institutionName: 'Coursera',
      isPresent: false,
      toDate: '2023-06-01'
    }
  ],
  project: [
    {
      city: '',
      country: '',
      description: `• Collaborative coding platform with a linux terminal, code editor, file browser, chat window, and video collection.
• Connected users using Socket.io to chat and see immediate changes to collaborators’ code editor and terminal.
• Used Docker to emulate a UNIX environment in browser with drag and drop file upload and file download.
• Created an API for Docker container control and NodeJS / ExpressJS server with a MySQL DB for user data.
• Incorporated YouTube API for seamless programming alongside educational videos.
• Built front-end using ReactJS and uses states to control permissions.`,
      fromDate: '2023-07-01',
      isPresent: false,
      projectRole: 'Software Engineer',
      title: 'PicoShell',
      toDate: '2023-12-01'
    },
    {
      city: '',
      country: '',
      description: `• Photo diary and photo organizer that uses photo-recognition APIs to tag and caption photos.
• Expanded and refined functionality of React Native codebase.
• Implemented search, geo-tags, and content sort using ExponentJS to improve UX.
• Configured continuous integration using CircleCI and Heroku to streamline build, test, and deployment.
• Rapidly prototyped and deployed mobile app using Exponent XDE.`,
      fromDate: '2022-01-01',
      isPresent: false,
      projectRole: 'Front-End Engineer / DevOps',
      title: 'TagMe',
      toDate: '2022-06-01'
    },
    {
      city: '',
      country: '',
      description: `• Spotify playlist generator based on time of day and weather forecast of any given roadtrip route.
• Integrated OAuth authentication with Spotify using PassportJS.
• Generated Spotify playlists tailored to user’s roadtrip route using Google Maps and Accuweather forecast.`,
      fromDate: '2021-05-01',
      isPresent: false,
      projectRole: 'Software Engineer',
      title: 'Roadtrip Mood Music Generator',
      toDate: '2021-08-01'
    },
    {
      city: '',
      country: '',
      description: `• Developed a web application for managing and tracking personal finances.
• Implemented user authentication, transaction categorization, and reporting features.
• Utilized React, Node.js, Express, and MongoDB for full-stack development.`,
      fromDate: '2020-09-01',
      isPresent: false,
      projectRole: 'Full-Stack Developer',
      title: 'Personal Finance Tracker',
      toDate: '2020-12-01'
    }
  ],
  publications: [
    {
      name: 'A Novel Approach to Recommendation Systems',
      publisher: 'Journal of Machine Learning Research',
      url: 'https://www.example.com/publication1',
      date: '2012-01-01'
    },
    {
      name: 'Improving User Experience in Mobile Applications',
      publisher: 'International Conference on Human-Computer Interaction',
      url: 'https://www.example.com/publication2',
      date: '2022-05-01'
    },
  ],
  references: [
    {
      company: 'Acme Corp',
      personName: 'Jane Doe',
      roleOfPerson: 'Team Lead',
      email: 'jane.doe@example.com',
      phoneNumber: '(555) 123-4567',
      description: 'Jane was my team lead and provided excellent guidance and support. She is a highly skilled and dedicated professional.',
    },
    {
      company: 'Tech Solutions Inc.',
      personName: 'John Smith',
      roleOfPerson: 'Project Manager',
      email: 'john.smith@example.com',
      phoneNumber: '(555) 987-6543',
      description: 'John was my project manager and consistently delivered projects on time and within budget. He is a strong leader and communicator.',
    },
  ],
  skills: ["ReactJS", "AngularJS 1.x", "ExpressJS", "NodeJS", "jQuery", "HTML/CSS",
    "React Native", "ExponentJS",
    " Spring", "Maven",
    "MongoDB", "SQL", "JavaScript", "TypeScript", "Docker", "Kubernetes", "CI/CD", "Git", "Agile Methodologies", "Scrum", "RESTful APIs"],
  summary: `An analytical and results‐driven software engineer with experience in application development, scripting and coding, automation, web application design, product testing and deployment, UI testing, and requirements gathering. Proven aptitude for implementing innovative solutions to streamline and automate processes, enhance efficiency, improve customer satisfaction, and achieve financial savings.`,
  userInfo: {
    email: 'sampleresume@gmail.com',
    firstName: 'First',
    headLine: 'Software Engineer | Full-Stack Developer | Cloud Enthusiast',
    lastName: 'Last',
    linkedInURL: 'linkedin.com/in/sampleresume',
    phoneNumber: '(480) 123‐5689',
    websiteOrOtherProfileURL: 'https://www.example.com',
    city: 'chongqing',
    country: 'China'
  },
  volunteering: [
    {
      name: 'Code for Good',
      role: 'Volunteer Developer',
      city: 'San Francisco',
      country: 'USA',
      fromDate: '2019-01-01',
      toDate: '2019-06-01',
      description: 'Developed a web application for a non-profit organization to help them manage their volunteer database.',
    },
    {
      name: 'Habitat for Humanity',
      role: 'Construction Volunteer',
      city: 'Phoenix',
      country: 'USA',
      fromDate: '2018-09-01',
      toDate: '2018-12-01',
      description: 'Assisted with the construction of affordable housing for low-income families.',
    },
    {
      name: 'Local Food Bank',
      role: 'Food Sorter',
      city: 'Phoenix',
      country: 'USA',
      fromDate: '2017-05-01',
      toDate: '2017-08-01',
      description: 'Sorted and organized food donations to ensure efficient distribution to those in need.',
    }
  ],
  workExperience: [
    {
      city: 'Bentonville',
      companyName: 'WALMART, INC.',
      country: 'Arkansas',
      description: `• Architected financial services hotline app for 8 countries in Central and South America.
      • Implemented benefits hotline app rollout every year for US and Canada serving 1.4 million employees.
• Optimized manual application tuning process with Java to fetch and process data, making process 20x faster.
• Connected user-facing web applications with SQL DBs using Spring REST web services.
• Integrated agent monitoring system, improving call center efficiency by 30%. [Employee of the Month - Dec 2012]`,
      fromDate: '2011-06-01',
      isPresent: false,
      jobTitle: 'Programmer Analyst, Call Center Engineering Team',
      toDate: '2016-05-01'
    },
    {
      city: 'San Francisco',
      companyName: 'Google',
      country: 'California',
      description: `• Developed and maintained key features for Google's search engine.
• Collaborated with a team of engineers to improve search relevance and performance.
• Utilized Java, Python, and C++ for backend development.
• Implemented unit tests and integration tests to ensure code quality.`,
      fromDate: '2016-06-01',
      isPresent: true,
      jobTitle: 'Software Engineer',
      toDate: ''
    }
  ]
});