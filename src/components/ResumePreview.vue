<template>
  <div class="resume-preview">
    <div>
      <!-- 引入功能区组件 -->
      <Toolbar/>
    </div>

    <div class="resume-container">
        <header class="resume-header">
          <h1>{{ store.userInfo.firstName + ' ' + store.userInfo.lastName }}</h1>
          <p>{{ store.userInfo.email }}</p>
          <p>{{ store.userInfo.city + ' ' + store.userInfo.country }}</p>
        </header>
        <section v-if="store.summary" class="resume-section">
          <h2>SUMMARY</h2>
          <p>{{ store.summary }}</p>
        </section>

        <section v-if="store.workExperience.length" class="resume-section">
          <h2>WORK EXPERIENCE</h2>
          <ul>
            <li v-for="(job, index) in store.workExperience" :key="index">
              <strong>{{ job.companyName }}</strong> | {{ job.city }}, {{ job.country }}
              <div>{{ job.jobTitle }}</div>
              <div>
                <span v-if="job.isPresent">({{ job.fromDate }} - Present)</span>
                <span v-else>({{ job.fromDate }} - {{ job.toDate }})</span>
              </div>
              <p>{{ job.description }}</p>
            </li>
          </ul>
        </section>
        <section v-if="store.education.length" class="resume-section">
          <h2>EDUCATION</h2>
          <ul>
            <li v-for="(edu, index) in store.education" :key="index">
              <strong>{{ edu.institutionName }}</strong> | {{ edu.city }}, {{ edu.country }}
              <div>{{ edu.degree }} in {{ edu.fieldOfStudy }}</div>
              <div>
                <span v-if="edu.isPresent">({{ edu.fromDate }} - Present)</span>
                <span v-else>({{ edu.fromDate }} - {{ edu.toDate }})</span>
              </div>
              <p v-if="edu.grade">Grade: {{ edu.grade }}</p>
              <p>{{ edu.description }}</p>
            </li>
          </ul>
        </section>

        <section v-if="store.skills.length" class="resume-section">
          <h2>Skills</h2>
          <ul>
            <li v-for="(skill, index) in store.skills" :key="index">
              {{ skill }}
            </li>
          </ul>
        </section>
        <section v-if="store.achievements" class="resume-section">
          <h2>Achievements</h2>
          <p>{{ store.achievements }}</p>
        </section>
        <section v-if="store.project.length" class="resume-section">
          <h2>Projects</h2>
          <ul>
            <li v-for="(project, index) in store.project" :key="index">
              <strong>{{ project.title }}</strong> | {{ project.city }}, {{ project.country }}
              <div>{{ project.projectRole }}</div>
              <div>
                <span v-if="project.isPresent">({{ project.fromDate }} - Present)</span>
                <span v-else>({{ project.fromDate }} - {{ project.toDate }})</span>
              </div>
              <p>{{ project.description }}</p>
            </li>
          </ul>
        </section>
        <section v-if="store.award.length" class="resume-section">
          <h2>Awards</h2>
          <ul>
            <li v-for="(award, index) in store.award" :key="index">
              <strong>{{ award.name }}</strong> | {{ award.dateOfAward }}
              <div>Issuer: {{ award.issuer }}</div>
              <p>{{ award.description }}</p>
              <p v-if="award.urlToAward">
                <a :href="award.urlToAward" target="_blank" rel="noopener noreferrer">
                  View Award Details
                </a>
              </p>
            </li>
          </ul>
        </section>
        <section v-if="store.certifications.length" class="resume-section">
          <h2>Certifications</h2>
          <ul>
            <li v-for="(cert, index) in store.certifications" :key="index">
              <strong>{{ cert.name }}</strong> | {{ cert.date }}
              <div>Issuer: {{ cert.issuer }}</div>
              <div v-if="cert.expiryDate">Expiry Date: {{ cert.expiryDate }}</div>
              <p>{{ cert.description }}</p>
              <p v-if="cert.url">
                <a :href="cert.url" target="_blank" rel="noopener noreferrer">
                  View Certification Details
                </a>
              </p>
            </li>
          </ul>
        </section>
      <section v-if="store.publications.length" class="resume-section">
        <h2>Publications</h2>
        <ul>
          <li v-for="(pub, index) in store.publications" :key="index">
            <!-- Publication Name -->
            <strong>{{ pub.name }}</strong> | {{ pub.date }}

            <!-- Publisher -->
            <div>Publisher: {{ pub.publisher }}</div>

            <!-- Publication URL -->
            <p v-if="pub.url">
              <a :href="pub.url" target="_blank" rel="noopener noreferrer">
                View Publication
              </a>
            </p>
          </li>
        </ul>
      </section>
      <section v-if="store.volunteering.length" class="resume-section">
        <h2>Volunteering</h2>
        <ul>
          <li v-for="(volunteer, index) in store.volunteering" :key="index">
            <!-- Volunteering Name -->
            <strong>{{ volunteer.name }}</strong> | {{ volunteer.city }}, {{ volunteer.country }}

            <!-- Role -->
            <div>{{ volunteer.role }}</div>

            <!-- Display Dates -->
            <div>
              <span v-if="volunteer.isPresent">({{ volunteer.fromDate }} - Present)</span>
              <span v-else>({{ volunteer.fromDate }} - {{ volunteer.toDate }})</span>
            </div>

            <!-- Description -->
            <p>{{ volunteer.description }}</p>
          </li>
        </ul>
      </section>
      <section v-if="store.references.length" class="resume-section">
        <h2>References</h2>
        <ul>
          <li v-for="(reference, index) in store.references" :key="index">
            <!-- Reference Name -->
            <strong>{{ reference.personName }}</strong> | {{ reference.roleOfPerson }}

            <!-- Company -->
            <div>Company: {{ reference.company }}</div>

            <!-- Contact Details -->
            <div>Email: <a :href="'mailto:' + reference.email">{{ reference.email }}</a></div>
            <div>Phone: {{ reference.phoneNumber }}</div>

            <!-- Description -->
            <p>{{ reference.description }}</p>
          </li>
        </ul>
      </section>
      </div>
    </div>
</template>

<script setup>
import Toolbar from './Toolbar.vue';
import {store} from '../store.js';
</script>

<style>
.resume-container {
  font-family: Arial, sans-serif;
  margin: 20px auto;
  padding: 20px;
  width: 8.27in;

  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.resume-header {
  text-align: center;
  margin-bottom: 20px;
}

.resume-header h1 {
  font-size: 2em;
  margin: 0;
}

.resume-header p {
  margin: 5px 0;
}

.resume-section {
  margin-bottom: 20px;
}

.resume-section h2 {
  border-bottom: 2px solid #6c5ce7;
  color: #333;
  margin-bottom: 10px;
}

.resume-section ul {
  list-style-type: none;
  padding: 0;
}

.resume-section ul li {
  margin-bottom: 15px;
}

.resume-section ul li strong {
  font-size: 1.2em;
}

.resume-section ul li div {
  margin: 5px 0;
}

.resume-section ul li p {
  margin-top: 5px;
  color: #555;
}

.resume-section ul li a {
  color: blue;
  text-decoration: underline;
}

</style>