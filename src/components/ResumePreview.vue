<template>
  <div class="resume-preview">
    <!-- 引入功能区组件 -->
    <Toolbar />
    <div class="section-header">
      <h2>{{ name }}</h2>
      <p>✉ {{ email }} | 📍 {{ location }}</p>
    </div>

    <div class="summary">
      <h3>SUMMARY</h3>
      <p>{{ summary }}</p>
    </div>

    <div class="experience">
      <h3>WORK EXPERIENCE</h3>
      <ul>
        <li v-for="item in experiences" :key="item.id">
          <strong>{{ item.company }}</strong> <br />
          {{ item.role }} | {{ item.date }}
          <ul>
            <li v-for="desc in item.details" :key="desc">{{ desc }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Toolbar from './Toolbar.vue';
export default {
  data() {
    return {
      name: 'JIAN LI',
      email: 'wktline@163.com',
      location: 'Hangzhou',
      summary:
          'In my current role, I am responsible for [briefly describe your responsibilities or tasks].',
      experiences: [
        {
          id: 1,
          company: 'Jobs Trading Co., Ltd.',
          role: 'Equipment Tester',
          date: 'Nov 2020 - Feb 2024',
          details: [
            'Collaborated with a team of engineers...',
            'Implemented and tested equipment solutions...',
          ],
        },
      ],
    };
  },components: {
    Toolbar,
  },
};
</script>

<style>
.resume-preview {
  width: 70%;
  padding: 0;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.section-header {
  text-align: center;
  border-bottom: 2px solid #6c5ce7;
  margin-bottom: 10px;
}
.summary, .experience {
  margin: 20px 0;
}
</style>