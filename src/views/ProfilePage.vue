<template>
  <div class="container  profile-page">
    <div class="row">
      <!-- Profile Sidebar -->
      <div class="col-lg-4">
        <div class="card mb-4 border-none">
          <div class="card-body text-center">
            <img
                src="@/assets/avatar.png"
                alt="Profile Picture"
                class="rounded-circle img-fluid mb-3"
                style="width: 150px;"
            />
            <h5 class="mb-1">{{ profile.name }}</h5>
            <p class="text-muted mb-3">{{ profile.title }}</p>
            <div class="d-flex justify-content-center mb-2">
              <button type="button" class="btn btn-primary me-2" @click="editProfile">
                Edit Profile
              </button>
              <!--              <button type="button" class="btn btn-outline-primary">Message</button>-->
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="col-lg-8">
        <div class="card mb-4">
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-sm-3">
                <h6 class="mb-0">Full Name</h6>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0">{{ profile.name }}</p>
              </div>
            </div>
            <hr>
            <div class="row mb-3">
              <div class="col-sm-3">
                <h6 class="mb-0">Email</h6>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0">{{ profile.email }}</p>
              </div>
            </div>
            <hr>
            <div class="row mb-3">
              <div class="col-sm-3">
                <h6 class="mb-0">Location</h6>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0">{{ profile.location }}</p>
              </div>
            </div>
            <hr>
            <div class="row mb-3">
              <div class="col-sm-3">
                <h6 class="mb-0">Bio</h6>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0">{{ profile.bio }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Edit Profile Modal -->
        <div class="modal fade" id="editProfileModal" tabindex="-1" ref="modalRef">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Edit Profile</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="saveProfile">
                  <div class="mb-3">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-control" v-model="editedProfile.name">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" v-model="editedProfile.email">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-control" v-model="editedProfile.location">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Bio</label>
                    <textarea class="form-control" rows="3" v-model="editedProfile.bio"></textarea>
                  </div>
                  <div class="text-end">
                    <button type="button" class="btn btn-secondary me-2" @click="closeModal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 m-auto">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Resume History</h5>
            <ul class="list-group list-group-flush">
              <li
                  v-for="resume in resumeHistory"
                  :key="resume.resume_id"
                  class="list-group-item"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{{ resume.resume_title }}</strong>
                    <br>
                    <small class="text-muted">Last Editsd: {{ resume.created_at }}</small>
                  </div>
                  <div>
                    <button
                        class="btn btn-sm btn-primary"
                        @click="viewResume(resume.resume_id)"
                    >
                      View
                    </button>
                  </div>
                </div>
              </li>
              <li v-if="!resumeHistory.length" class="list-group-item text-center">
                No resume history available.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import axios from 'axios';
import {model} from '@/model.js';
import router from '@/router/index.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const modalRef = ref(null);

let bootstrapModal = null;

const profile = reactive({
  name: 'John Doe',
  title: 'Software Developer',
  email: 'john.doe@example.com',
  location: 'New York, USA',
  bio: 'Passionate software developer with experience in Vue.js and web development.',
  stats: {
    posts: 142,
    followers: 562,
    following: 231
  }
});

const editedProfile = reactive({...profile});

const resumeHistory = ref([]);

const editProfile = () => {
  Object.assign(editedProfile, profile);
  if (!bootstrapModal) {
    bootstrapModal = new Modal(modalRef.value);
  }
  bootstrapModal.show();
};

const closeModal = () => {
  if (bootstrapModal) {
    bootstrapModal.hide();
  }
};

const saveProfile = () => {
  Object.assign(profile, editedProfile);
  closeModal();
};

const fetchResumeHistory = async () => {

/*  const response = await axios.get(`${API_URL}/api/get_resume_list`,
      {
        headers: {'Content-Type': 'multipart/form-data'},
        withCredentials: true
      });
  if(response.status === 200){
    response.data.forEach(resume => {
      resume.created_at = resume.created_at.replace("T"," ").replace("Z","")
    })
    resumeHistory.value = response.data;
  }else {
    console.error('Failed to fetch resume history.');
  }*/

  // Simulated data for demonstration purposes
  const simulatedResponse = {
    status: 200,
    data: [
      {
        resume_id: 12345,
        resume_title: 'Senior Software Engineer Resume',
        created_at: '2025-02-21T10:30:00Z'
      },
      {
        resume_id: 12346,
        resume_title: 'Data Scientist Resume',
        created_at: '2025-02-20T15:45:00Z'
      },
      {
        resume_id: 12347,
        resume_title: 'AI Researcher Resume',
        created_at: '2025-02-19T08:15:00Z'
      }
    ]
  };

  if (simulatedResponse.status === 200) {
    simulatedResponse.data.forEach(resume => {
      resume.created_at = resume.created_at.replace("T"," ").replace("Z","")
    })
    resumeHistory.value = simulatedResponse.data;
  } else {
    console.error('Failed to fetch resume history.');
  }
};

onMounted(() => {
  fetchResumeHistory();
});

const viewResume  = async (resumeId) => {
  console.log(resumeId)
  const simulatedResponse = {
    status: 200,
    data: {
      "resume": {
        "achievements": [
          "Led team to 40% improvement in app performance",
          "Implemented CI/CD pipeline reducing deployment time by 60%",
          "Received Best Employee Award 2023"
        ],
        "award": [
          {
            "dateOfAward": "2023-12",
            "description": "Awarded for exceptional performance and team leadership",
            "issuer": "Tech Corp",
            "name": "Best Employee Award",
            "urlToAward": "https://techcorp.com/awards/2023"
          }
        ],
        "certifications": [
          {
            "date": "2022-06",
            "description": "Advanced AWS development certification",
            "expiryDate": "2025-06",
            "issuer": "Amazon Web Services",
            "name": "AWS Certified Developer",
            "url": "https://aws.amazon.com/certification/verify"
          }
        ],
        "education": [
          {
            "city": "Boston",
            "country": "USA",
            "degree": "Bachelor of Science",
            "description": "Major in Software Engineering",
            "fieldOfStudy": "Computer Science",
            "fromDate": "2015-09",
            "grade": "3.8",
            "institutionName": "University of Technology",
            "isPresent": false,
            "toDate": "2019-05"
          }
        ],
        "project": [
          {
            "city": "San Francisco",
            "country": "USA",
            "description": "Built scalable e-commerce platform using React and Node.js",
            "fromDate": "2021-03",
            "isPresent": false,
            "projectRole": "Lead Developer",
            "title": "E-commerce Platform",
            "toDate": "2021-12"
          }
        ],
        "publications": [
          {
            "date": "2023-03",
            "name": "Modern Frontend Architecture",
            "publisher": "Tech Blog",
            "url": "https://techblog.com/frontend-architecture"
          }
        ],
        "skills": [
          "JavaScript",
          "TypeScript",
          "React",
          "Node.js",
          "AWS",
          "Git",
          "Docker"
        ],
        "summary": "Experienced frontend developer with 5 years of experience in React and TypeScript",
        "userInfo": {
          "email": "john.doe@example.com",
          "firstName": "John",
          "headLine": "Senior Frontend Developer",
          "lastName": "Doe",
          "linkedInURL": "https://linkedin.com/in/johndoe",
          "phoneNumber": "123-456-7890",
          "websiteOrOtherProfileURL": "https://github.com/johndoe"
        },
        "workExperience": [
          {
            "city": "San Francisco",
            "companyName": "Tech Corp",
            "country": "USA",
            "description": "Lead frontend development team of 5 engineers",
            "fromDate": "2020-01",
            "isPresent": true,
            "jobTitle": "Senior Frontend Developer",
            "toDate": ""
          }
        ]
      },
      "resume_title": "Frontend Developer Position"
    }
  };
  if (simulatedResponse.status === 200) {
    // 1) 先删除旧属性
    Object.keys(model).forEach(key => {
      delete model[key]
    })
    // 2) 把 newData 的属性合并进来
    Object.assign(model, simulatedResponse.data.resume);
    console.log(model);
    await router.push("/resume");
  }

  /*const response = await axios.get(`${API_URL}/api/get_resume/${resumeId}`)
  if(response.status === 200){
    // 1) 先删除旧属性
    Object.keys(model).forEach(key => {
      delete model[key]
    })
    // 2) 把 newData 的属性合并进来
    Object.assign(model, response.data.resume);
    console.log(model);
    await router.push("/resume");
  }else{
    console.error('Failed to fetch resume.');
  }*/
}

</script>

<style scoped>
.card {
  border-radius: 15px;
}

.card-body {
  padding: 1.5rem;
}

.rounded-circle {
  border: 3px solid #f8f9fa;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-page {
  padding-top: 100px;
}
</style>