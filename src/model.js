import {reactive, ref} from 'vue';
export const model = reactive({
  achievements: [],
  award: [],
  certifications: [],
  education: [
    {
      city: 'Tucson',
      country: 'Arizona',
      degree: 'M.S.',
      description: '',
      fieldOfStudy: 'Computer Science',
      fromDate: '',
      grade: '',
      institutionName: 'UNIVERSITY OF ARIZONA',
      isPresent: false,
      toDate: '2012'
    },
    {
      city: 'Tucson',
      country: 'Arizona',
      degree: 'B.S.B.A.',
      description: '',
      fieldOfStudy: 'Management Information Systems',
      fromDate: '',
      grade: '',
      institutionName: 'UNIVERSITY OF ARIZONA',
      isPresent: false,
      toDate: '2011'
    }
  ],
  projects: [
    {
      city: '',
      country: '',
      description: `Collaborative coding platform with a linux terminal, code editor, file browser, chat window, and video collection.
• Connected users using Socket.io to chat and see immediate changes to collaborators’ code editor and terminal.
• Used Docker to emulate a UNIX environment in browser with drag and drop file upload and file download.
• Created an API for Docker container control and NodeJS / ExpressJS server with a MySQL DB for user data.
• Incorporated YouTube API for seamless programming alongside educational videos.
• Built front-end using ReactJS and uses states to control permissions.`,
      fromDate: '',
      isPresent: false,
      projectRole: 'Software Engineer',
      title: 'PicoShell',
      toDate: ''
    },
    {
      city: '',
      country: '',
      description: `Photo diary and photo organizer that uses photo-recognition APIs to tag and caption photos.
• Expanded and refined functionality of React Native codebase.
• Implemented search, geo-tags, and content sort using ExponentJS to improve UX.
• Configured continuous integration using CircleCI and Heroku to streamline build, test, and deployment.
• Rapidly prototyped and deployed mobile app using Exponent XDE.`,
      fromDate: '',
      isPresent: false,
      projectRole: 'Front-End Engineer / DevOps',
      title: 'TagMe',
      toDate: ''
    },
    {
      city: '',
      country: '',
      description: `Spotify playlist generator based on time of day and weather forecast of any given roadtrip route.
• Integrated OAuth authentication with Spotify using PassportJS.
• Generated Spotify playlists tailored to user’s roadtrip route using Google Maps and Accuweather forecast.`,
      fromDate: '',
      isPresent: false,
      projectRole: 'Software Engineer',
      title: 'Roadtrip Mood Music Generator',
      toDate: ''
    }
  ],
  publications: [],
  references: [],
  skills: [
    'JavaScript: ReactJS, AngularJS 1.x, ExpressJS, NodeJS, jQuery, HTML/CSS',
    'Mobile: React Native, ExponentJS',
    'Java: Spring, Maven',
    'Databases: MongoDB, SQL',
    'Build/Deploy: Docker, Tomcat, Grunt, Heroku, CircleCI'
  ],
  summary: `An analytical and results‐driven software engineer with experience in application development, scripting and coding, automation, web application design, product testing and deployment, UI testing, and requirements gathering. Proven aptitude for implementing innovative solutions to streamline and automate processes, enhance efficiency, improve customer satisfaction, and achieve financial savings.`,
  userInfo: {
    email: 'sampleresume@gmail.com',
    firstName: 'First',
    headLine: '',
    lastName: 'Last',
    linkedInURL: 'linkedin.com/in/sampleresume',
    phoneNumber: '(480) 123‐5689',
    websiteOrOtherProfileURL: '',
    city:"chongqing",
    country:"China"
  },
  volunteering: [],
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
      fromDate: '2011',
      isPresent: false,
      jobTitle: 'Programmer Analyst, Call Center Engineering Team',
      toDate: '2016'
    }
  ]
});

export const fileName = ref('resume.pdf');