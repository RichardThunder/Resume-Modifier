<template>
  <div class="resume-preview">
    <div>
      <!-- 引入功能区组件 -->
      <Toolbar/>
    </div>
    <div class="resume-area">
    <div class="resume-container">
      <header class="resume-header">
        <div style="display: flex;flex-direction: column; ">
        <h1>{{ store.userInfo.firstName + ' ' + store.userInfo.lastName }}</h1>
         <div style="margin: 0 0 0 0;" >
          <p>{{store.userInfo.headLine}}</p>
           <p>
           <I>{{ store.userInfo.city + ' ' + store.userInfo.country }}</I>
           </p>
         </div>
        </div>
        <div>
        <p>{{ store.userInfo.email }}</p>

          <p>{{store.userInfo.phoneNumber}}</p>
          <p>{{store.userInfo.linkedInURL}}</p>
          <p>{{store.userInfo.websiteOrOtherProfileURL}}</p>
        </div>
      </header>
      <section v-if="store.summary" class="resume-section">
        <h2>SUMMARY</h2>
        <p>{{ store.summary }}</p>
      </section>

      <section v-if="store.workExperience.length" class="resume-section">
        <h2>WORK EXPERIENCE</h2>
        <ul>
          <li v-for="(job, index) in store.workExperience" :key="index" class="list-block">
            <div class="flex-col width25">
              <div class="title">{{ job.companyName }}</div>
              <p><I>{{ job.city }}<span v-if="job.city && job.country">,</span> {{ job.country }}</I></p>
              <I v-if="job.isPresent">({{ job.fromDate }} - Present)</I>
              <I v-else>{{ job.fromDate }} <span v-if="job.fromDate && job.toDate">-</span> {{ job.toDate }}</I>
            </div>
            <div class="width75 flex-col">
              <div class="title">{{ job.jobTitle }}</div>
              <p>{{ job.description }}</p>
            </div>
          </li>
        </ul>
      </section>


      <section v-if="store.education.length" class="resume-section">
        <h2>EDUCATION</h2>
        <ul>
          <li v-for="(edu, index) in store.education" :key="index" class="list-block">
            <div class="flex-col width25">
              <div class="title">{{ edu.institutionName }}</div>
              <p><I>{{ edu.city }}<span v-if="edu.city && edu.country">,</span>  {{ edu.country }}</I></p>

              <I v-if="edu.isPresent">({{ edu.fromDate }} - Present)</I>
              <I v-else>{{ edu.fromDate }} <span v-if="edu.fromDate && edu.toDate">-</span> {{ edu.toDate }}</I>
            </div>
            <div class="width75 flex-col">
              <div class="title">{{ edu.degree }} <span v-if="edu.degree && edu.fieldOfStudy">in</span> {{ edu.fieldOfStudy }} <span v-if="edu.grade">(Grade: {{
                  edu.grade
                }})</span></div>
              <p>{{ edu.description }}</p>
            </div>
          </li>
        </ul>
      </section>

      <section v-if="store.skills.length" class="resume-section">
        <h2>Skills</h2>
        <p>
          <span v-for="(skill, index) in store.skills" :key="index">
            {{ skill }}
          </span>
        </p>
      </section>


      <section v-if="store.achievements" class="resume-section">
        <h2>Achievements</h2>
        <p>{{ store.achievements }}</p>
      </section>

      <section v-if="store.project.length" class="resume-section">
        <h2>Projects</h2>
        <ul>
          <li v-for="(project, index) in store.project" :key="index" class="list-block">
            <div class="flex-col width25">
              <div class="title">{{ project.title }}</div>
              <p><I>{{ project.city }}<span v-if="project.city && project.country">,</span> {{ project.country }}</I></p>
              <I v-if="project.isPresent">({{ project.fromDate }} - Present)</I>
              <I v-else>{{ project.fromDate }} <span v-if="project.fromDate && project.toDate">-</span>  {{ project.toDate }}</I>
            </div>
            <div class="width75 flex-col">
              <div class="title">{{ project.projectRole }}</div>
              <p>{{ project.description }}</p>
            </div>
          </li>
        </ul>
      </section>
      <section v-if="store.award.length" class="resume-section">
        <h2>Awards</h2>
        <ul>
          <li v-for="(award, index) in store.award" :key="index" class="list-block">
            <div class="flex-col width25">
              <p v-if="award.urlToAward">
                <a :href="award.urlToAward" target="_blank" rel="noopener noreferrer">
                  View Details
                </a>
              </p>
              <I>{{ award.dateOfAward }}</I>
            </div>
            <div class="width75 flex-col">
              <div class="title">{{ award.name }} <span v-if="award.name && award.issuer">by</span> {{ award.issuer }}</div>
              <p>{{ award.description }}</p>

            </div>
          </li>
        </ul>
      </section>
      <section v-if="store.certifications.length" class="resume-section">
        <h2>Certifications</h2>
        <ul>
          <li v-for="(cert, index) in store.certifications" :key="index" class="list-block">
            <div class="flex-col width25">
              <p v-if="cert.url">
                <a :href="cert.url" target="_blank" rel="noopener noreferrer">
                  View Details
                </a>
              </p>
              <I>{{ cert.date }}</I>

            </div>
            <div class="width75 flex-col">
              <div class="title">{{ cert.name }}<span v-if="cert.name&&cert.issuer">by</span>  {{ cert.issuer }}</div>
              <p>{{ cert.description }}</p>
            </div>
            <!--            <div v-if="cert.expiryDate">Expiry Date: {{ cert.expiryDate }}</div>-->
          </li>
        </ul>
      </section>
      <section v-if="store.publications.length" class="resume-section">
        <h2>Publications</h2>
        <ul>
          <li v-for="(pub, index) in store.publications" :key="index" class="list-block">
            <div class="flex-col width25">
              <p v-if="pub.url">
                <a :href="pub.url" target="_blank" rel="noopener noreferrer">
                  View Publication
                </a>
              </p>
              <I> {{ pub.date }}</I>
            </div>
            <div class="flex-col width75">
              <!-- Publication Name -->
              <div class="title">{{ pub.name }}</div>
              <!-- Publisher -->
              <div v-if="pub.publisher">Publisher: {{ pub.publisher }}</div>
            </div>
          </li>
        </ul>
      </section>
      <section v-if="store.volunteering.length" class="resume-section">
        <h2>Volunteering</h2>
        <ul>
          <li v-for="(volunteer, index) in store.volunteering" :key="index" class="list-block">
            <div class="flex-col width25">
              <p><I>{{ volunteer.city }} <span v-if="volunteer.city && volunteer.country">,</span>{{ volunteer.country }}</I></p>
              <I v-if="volunteer.isPresent">({{ volunteer.fromDate }} - Present)</I>
              <I v-else >{{ volunteer.fromDate }} <span v-if="volunteer.fromDate && volunteer.toDate">-</span> {{ volunteer.toDate }}</I>
            </div>
            <div class="flex-col width75">
              <div class="title">{{ volunteer.role }} <span v-if="volunteer.role && volunteer.name">in</span>{{ volunteer.name }}</div>
              <p>{{ volunteer.description }}</p>
            </div>
          </li>
        </ul>
      </section>
      <section v-if="store.references.length" class="resume-section">
        <h2>References</h2>
        <ul>
          <li v-for="(reference, index) in store.references" :key="index" class="list-block">
            <div class="flex-col width25">
              <div class="title">{{ reference.company }}</div>
              <div><a :href="'mailto:' + reference.email">{{ reference.email }}</a></div>
              <div>{{ reference.phoneNumber }}</div>
            </div>
            <div class="flex-col width75">
              <div class="title">{{ reference.personName }}</div>
              <p>{{ reference.description }}</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
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
  margin: 0 auto;
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
  display: flex;
  justify-content: space-between;
  padding:10px 50px 0 10px;
}

.resume-header h1 {
  font-size: 2em;
  margin: 0;
}

.resume-header p {
  margin:  0;
}

.resume-section {
  margin-bottom: 20px;
  page-break-inside: avoid;
  break-inside: avoid;
}

.resume-section h2 {
  border-bottom: 2px solid rgba(120, 197, 206, 0.55);
  color: #333;
  margin-bottom: 10px;
  font-size: 24px;
  background-color: rgba(158, 204, 209, 0.77);
}

.resume-section p span {
  margin-right: 10px;
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
  margin: 0;
}

.resume-section ul li p {
  margin: 0;
  color: #555;
}

.resume-section ul li a {
  color: blue;
  text-decoration: underline;
}

.list-block {
  display: flex;
  justify-content: space-between;
}

.list-block p {
  font-size: 18px;
}

.list-block I {
  font-size: 14px;
}

.width75 {
  width: 75%;
}
.width25{
  width: 25%;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.title {
  font-size: 20px;
  font-weight: bolder;
}

.skill-list {
  display: flex;
  flex-wrap: wrap; /* 自动换行 */
  justify-content: flex-start; /* 左对齐 */
  gap: 10px; /* 元素间距 */
}

</style>