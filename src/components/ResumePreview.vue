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
          <h1>{{ model.userInfo.firstName + ' ' + model.userInfo.lastName }}</h1>
          <div style="margin: 0 0 0 0;" >
            <p>{{model.userInfo.headLine}}</p>
            <p>
              <I>{{ model.userInfo.city + ' ' + model.userInfo.country }}</I>
            </p>
          </div>
        </div>
        <div>
          <p>{{ model.userInfo.email }}</p>

          <p>{{model.userInfo.phoneNumber}}</p>
          <p>{{model.userInfo.linkedInURL}}</p>
          <p>{{model.userInfo.websiteOrOtherProfileURL}}</p>
        </div>
      </header>

      <section v-if="model.summary" class="resume-section">
        <h2>SUMMARY</h2>
        <div v-if="!isEditingSummary" @dblclick="enableSummaryEdit">
          <p>{{ model.summary }}</p>
        </div>
        <div v-else>
    <textarea
        v-model="model.summary"
        @blur="saveSummaryEdit"
        rows="3"
        style="width: 100%; font-size: 16px; border: 1px solid #ccc; padding: 5px; resize: none;"
    ></textarea>
        </div>

      </section>
      <section v-if="model.workExperience.length" class="resume-section">
        <h2>WORK EXPERIENCE</h2>
        <ul>
          <li
              v-for="(job, index) in model.workExperience"
              :key="index"
              class="list-block"
          >
            <div class="flex-col width25">
              <!-- companyName -->
              <template v-if="!editingWorkFields[index]?.companyName">
                <div
                    class="title"
                    @dblclick="enableWorkEdit(index, 'companyName')"
                >
                  {{ job.companyName }}
                </div>
              </template>
              <template v-else>
                <input
                    type="text"
                    class="title"
                    v-model="job.companyName"
                    @blur="disableWorkEdit(index, 'companyName')"
                />
              </template>

              <!-- city & country -->
              <p>
                <!-- city -->
                <i v-if="!editingWorkFields[index]?.city"
                   @dblclick="enableWorkEdit(index, 'city')">
                  {{ job.city }}
                </i>
                <input
                    v-else
                    type="text"
                    v-model="job.city"
                    @blur="disableWorkEdit(index, 'city')"
                />
                <span v-if="job.city && job.country">,</span>

                <!-- country -->
                <i v-if="!editingWorkFields[index]?.country"
                   @dblclick="enableWorkEdit(index, 'country')">
                  {{ job.country }}
                </i>
                <input
                    v-else
                    type="text"
                    v-model="job.country"
                    @blur="disableWorkEdit(index, 'country')"
                />
              </p>

              <!-- 日期：isPresent / fromDate / toDate -->
              <i v-if="job.isPresent">
                (<span
                  v-if="!editingWorkFields[index]?.fromDate"
                  @dblclick="enableWorkEdit(index, 'fromDate')"
              >
          {{ job.fromDate }}
        </span>
                <input
                    v-else
                    type="text"
                    v-model="job.fromDate"
                    @blur="disableWorkEdit(index, 'fromDate')"
                />
                - Present)
              </i>
              <i v-else>
        <span
            v-if="!editingWorkFields[index]?.fromDate"
            @dblclick="enableWorkEdit(index, 'fromDate')"
        >
          {{ job.fromDate }}
        </span>
                <input
                    v-else
                    type="text"
                    v-model="job.fromDate"
                    @blur="disableWorkEdit(index, 'fromDate')"
                />
                <span v-if="job.fromDate && job.toDate">-</span>
                <span
                    v-if="!editingWorkFields[index]?.toDate"
                    @dblclick="enableWorkEdit(index, 'toDate')"
                >
          {{ job.toDate }}
        </span>
                <input
                    v-else
                    type="text"
                    v-model="job.toDate"
                    @blur="disableWorkEdit(index, 'toDate')"
                />
              </i>
            </div>

            <div class="width75 flex-col">
              <!-- jobTitle -->
              <template v-if="!editingWorkFields[index]?.jobTitle">
                <div
                    class="title"
                    @dblclick="enableWorkEdit(index, 'jobTitle')"
                >
                  {{ job.jobTitle }}
                </div>
              </template>
              <template v-else>
                <input
                    type="text"
                    class="title"
                    v-model="job.jobTitle"
                    @blur="disableWorkEdit(index, 'jobTitle')"
                />
              </template>

              <!-- description -->
              <template v-if="!editingWorkFields[index]?.description">
                <p @dblclick="enableWorkEdit(index, 'description')">
                  {{ job.description }}
                </p>
              </template>
              <template v-else>
        <textarea
            rows="3"
            v-model="job.description"
            @blur="disableWorkEdit(index, 'description')"
        ></textarea>
              </template>
            </div>
          </li>
        </ul>
      </section>
      <section v-if="model.skills.length" class="resume-section">
        <h2>Skills</h2>
        <ul>
          <span v-for="(skill, index) in model.skills" :key="index">
            <!-- 非编辑状态 -->
            <span
                v-if="!editingSkillFields[index]"
                @dblclick="enableSkillEdit(index)"
            >
        {{ skill }} {{ }}
      </span>

            <!-- 编辑状态 -->
            <input
                v-else
                type="text"
                v-model="model.skills[index]"
                @blur="disableSkillEdit(index)"
            />
          </span>
        </ul>
      </section>
      <section v-if="model.achievements" class="resume-section">
        <h2>Achievements</h2>

        <!-- 非编辑状态 -->
        <div v-if="!isEditingAchievements" @dblclick="enableAchievementsEdit">
          <p>{{ model.achievements }}</p>
        </div>

        <!-- 编辑状态 -->
        <div v-else>
    <textarea
        rows="3"
        v-model="model.achievements"
        @blur="saveAchievementsEdit"
        style="width: 100%; font-size: 16px; border: 1px solid #ccc; padding: 5px; resize: none;"
    ></textarea>
        </div>
      </section>

      <section v-if="model.project.length" class="resume-section">
        <h2>Projects</h2>
        <ul>
          <li
              v-for="(project, index) in model.project"
              :key="index"
              class="list-block"
          >
            <div class="flex-col width25">
              <!-- title -->
              <template v-if="!editingProjectFields[index]?.title">
                <div
                    class="title"
                    @dblclick="enableProjectEdit(index, 'title')"
                >
                  {{ project.title }}
                </div>
              </template>
              <template v-else>
                <input
                    type="text"
                    class="title"
                    v-model="project.title"
                    @blur="disableProjectEdit(index, 'title')"
                />
              </template>

              <!-- city & country -->
              <p>
                <!-- city -->
                <template v-if="!editingProjectFields[index]?.city">
                  <i @dblclick="enableProjectEdit(index, 'city')">
                    {{ project.city }}
                  </i>
                </template>
                <template v-else>
                  <input
                      type="text"
                      v-model="project.city"
                      @blur="disableProjectEdit(index, 'city')"
                  />
                </template>
                <span v-if="project.city && project.country">,</span>

                <!-- country -->
                <template v-if="!editingProjectFields[index]?.country">
                  <i @dblclick="enableProjectEdit(index, 'country')">
                    {{ project.country }}
                  </i>
                </template>
                <template v-else>
                  <input
                      type="text"
                      v-model="project.country"
                      @blur="disableProjectEdit(index, 'country')"
                  />
                </template>
              </p>

              <!-- 日期 -->
              <i v-if="project.isPresent">
                (
                <span
                    v-if="!editingProjectFields[index]?.fromDate"
                    @dblclick="enableProjectEdit(index, 'fromDate')"
                >
            {{ project.fromDate }}
          </span>
                <input
                    v-else
                    type="text"
                    v-model="project.fromDate"
                    @blur="disableProjectEdit(index, 'fromDate')"
                />
                - Present)
              </i>
              <i v-else>
          <span
              v-if="!editingProjectFields[index]?.fromDate"
              @dblclick="enableProjectEdit(index, 'fromDate')"
          >
            {{ project.fromDate }}
          </span>
                <input
                    v-else
                    type="text"
                    v-model="project.fromDate"
                    @blur="disableProjectEdit(index, 'fromDate')"
                />
                <span v-if="project.fromDate && project.toDate">-</span>
                <span
                    v-if="!editingProjectFields[index]?.toDate"
                    @dblclick="enableProjectEdit(index, 'toDate')"
                >
            {{ project.toDate }}
          </span>
                <input
                    v-else
                    type="text"
                    v-model="project.toDate"
                    @blur="disableProjectEdit(index, 'toDate')"
                />
              </i>
            </div>

            <div class="width75 flex-col">
              <!-- projectRole -->
              <template v-if="!editingProjectFields[index]?.projectRole">
                <div
                    class="title"
                    @dblclick="enableProjectEdit(index, 'projectRole')"
                >
                  {{ project.projectRole }}
                </div>
              </template>
              <template v-else>
                <input
                    type="text"
                    class="title"
                    v-model="project.projectRole"
                    @blur="disableProjectEdit(index, 'projectRole')"
                />
              </template>

              <!-- description -->
              <template v-if="!editingProjectFields[index]?.description">
                <p @dblclick="enableProjectEdit(index, 'description')">
                  {{ project.description }}
                </p>
              </template>
              <template v-else>
          <textarea
              rows="3"
              v-model="project.description"
              @blur="disableProjectEdit(index, 'description')"
          ></textarea>
              </template>
            </div>
          </li>
        </ul>
      </section>
      <section v-if="model.award.length" class="resume-section">
        <h2>Awards</h2>
        <ul>
          <li
              v-for="(award, index) in model.award"
              :key="index"
              class="list-block"
          >
            <div class="flex-col width25">
              <!-- urlToAward (仍保持超链接显示，不需要编辑的话可不动) -->
              <p v-if="award.urlToAward">
                <a :href="award.urlToAward" target="_blank" rel="noopener noreferrer">
                  View Details
                </a>
              </p>

              <!-- dateOfAward: 双击编辑 -->
              <template v-if="!editingAwardFields[index]?.dateOfAward">
                <i @dblclick="enableAwardEdit(index, 'dateOfAward')">
                  {{ award.dateOfAward }}
                </i>
              </template>
              <template v-else>
                <input
                    type="text"
                    v-model="award.dateOfAward"
                    @blur="disableAwardEdit(index, 'dateOfAward')"
                />
              </template>
            </div>

            <div class="width75 flex-col">
              <!-- name + issuer: 可以一起放在一个模板中 -->
              <template v-if="!editingAwardFields[index]?.name">
                <div
                    class="title"
                    @dblclick="enableAwardEdit(index, 'name')"
                >
                  {{ award.name }}
                  <span v-if="award.name && award.issuer">by</span>
                  {{ award.issuer }}
                </div>
              </template>
              <template v-else>
                <!-- 这里可根据需求拆分：一个输入框编辑 name，另一个编辑 issuer -->
                <input
                    type="text"
                    class="title"
                    placeholder="Award Name"
                    v-model="award.name"
                    @blur="disableAwardEdit(index, 'name')"
                />
                <input
                    type="text"
                    class="title"
                    placeholder="Award Issuer"
                    v-model="award.issuer"
                    @blur="disableAwardEdit(index, 'name')"
                />
              </template>

              <!-- description: 双击编辑 -->
              <template v-if="!editingAwardFields[index]?.description">
                <p @dblclick="enableAwardEdit(index, 'description')">
                  {{ award.description }}
                </p>
              </template>
              <template v-else>
          <textarea
              rows="3"
              v-model="award.description"
              @blur="disableAwardEdit(index, 'description')"
          ></textarea>
              </template>
            </div>
          </li>
        </ul>
      </section>
      <section v-if="model.certifications.length" class="resume-section">
        <h2>Certifications</h2>
        <ul>
          <li
              v-for="(cert, index) in model.certifications"
              :key="index"
              class="list-block"
          >
            <div class="flex-col width25">
              <!-- url (不需要编辑的话可保留原样) -->
              <p v-if="cert.url">
                <a :href="cert.url" target="_blank" rel="noopener noreferrer">
                  View Details
                </a>
              </p>

              <!-- date: 双击可编辑 -->
              <template v-if="!editingCertFields[index]?.date">
                <i @dblclick="enableCertEdit(index, 'date')">
                  {{ cert.date }}
                </i>
              </template>
              <template v-else>
                <input
                    type="text"
                    v-model="cert.date"
                    @blur="disableCertEdit(index, 'date')"
                />
              </template>
            </div>

            <div class="width75 flex-col">
              <!-- name + issuer: 可以合并或拆分编辑 -->
              <template v-if="!editingCertFields[index]?.name">
                <div
                    class="title"
                    @dblclick="enableCertEdit(index, 'name')"
                >
                  {{ cert.name }}
                  <span v-if="cert.name && cert.issuer"> by </span>
                  {{ cert.issuer }}
                </div>
              </template>
              <template v-else>
                <!-- 可以拆分成两个输入框分别编辑 name 和 issuer -->
                <input
                    type="text"
                    class="title"
                    placeholder="Certification Name"
                    v-model="cert.name"
                    @blur="disableCertEdit(index, 'name')"
                />
                <input
                    type="text"
                    class="title"
                    placeholder="Issuer"
                    v-model="cert.issuer"
                    @blur="disableCertEdit(index, 'name')"
                />
              </template>

              <!-- description: 双击可编辑 -->
              <template v-if="!editingCertFields[index]?.description">
                <p @dblclick="enableCertEdit(index, 'description')">
                  {{ cert.description }}
                </p>
              </template>
              <template v-else>
          <textarea
              rows="3"
              v-model="cert.description"
              @blur="disableCertEdit(index, 'description')"
          ></textarea>
              </template>

              <!-- 如果还有 expiryDate 之类的字段，也可仿照上面添加双击编辑 -->
              <!--
              <template v-if="cert.expiryDate && !editingCertFields[index]?.expiryDate">
                <div @dblclick="enableCertEdit(index, 'expiryDate')">
                  Expiry Date: {{ cert.expiryDate }}
                </div>
              </template>
              <template v-else-if="cert.expiryDate">
                <input
                  type="text"
                  placeholder="Expiry Date"
                  v-model="cert.expiryDate"
                  @blur="disableCertEdit(index, 'expiryDate')"
                />
              </template>
              -->
            </div>
          </li>
        </ul>
      </section>
      <section v-if="model.publications.length" class="resume-section">
        <h2>Publications</h2>
        <ul>
          <li
              v-for="(pub, index) in model.publications"
              :key="index"
              class="list-block"
          >
            <div class="flex-col width25">
              <!-- 如果 url 不需要编辑，可保留原样 -->
              <p v-if="pub.url">
                <a :href="pub.url" target="_blank" rel="noopener noreferrer">
                  View Publication
                </a>
              </p>

              <!-- date: 双击可编辑 -->
              <template v-if="!editingPublications[index]?.date">
                <i @dblclick="enablePublicationEdit(index, 'date')">
                  {{ pub.date }}
                </i>
              </template>
              <template v-else>
                <input
                    type="text"
                    v-model="pub.date"
                    @blur="disablePublicationEdit(index, 'date')"
                />
              </template>
            </div>

            <div class="flex-col width75">
              <!-- Publication name -->
              <template v-if="!editingPublications[index]?.name">
                <div
                    class="title"
                    @dblclick="enablePublicationEdit(index, 'name')"
                >
                  {{ pub.name }}
                </div>
              </template>
              <template v-else>
                <input
                    type="text"
                    class="title"
                    v-model="pub.name"
                    @blur="disablePublicationEdit(index, 'name')"
                />
              </template>

              <!-- publisher -->
              <template v-if="pub.publisher && !editingPublications[index]?.publisher">
                <div @dblclick="enablePublicationEdit(index, 'publisher')">
                  Publisher: {{ pub.publisher }}
                </div>
              </template>
              <template v-else-if="pub.publisher">
                <input
                    type="text"
                    v-model="pub.publisher"
                    @blur="disablePublicationEdit(index, 'publisher')"
                />
              </template>
            </div>
          </li>
        </ul>
      </section>
      <section v-if="model.volunteering.length" class="resume-section">
        <h2>Volunteering</h2>
        <ul>
          <li
              v-for="(volunteer, index) in model.volunteering"
              :key="index"
              class="list-block"
          >
            <!-- 左侧：城市、国家、日期 -->
            <div class="flex-col width25">

              <!-- city / country -->
              <p>
                <!-- city -->
                <template v-if="!editingVolunteeringFields[index]?.city">
                  <i @dblclick="enableVolunteeringEdit(index, 'city')">
                    {{ volunteer.city }}
                  </i>
                </template>
                <template v-else>
                  <input
                      type="text"
                      v-model="volunteer.city"
                      @blur="disableVolunteeringEdit(index, 'city')"
                  />
                </template>

                <span v-if="volunteer.city && volunteer.country">,</span>

                <!-- country -->
                <template v-if="!editingVolunteeringFields[index]?.country">
                  <i @dblclick="enableVolunteeringEdit(index, 'country')">
                    {{ volunteer.country }}
                  </i>
                </template>
                <template v-else>
                  <input
                      type="text"
                      v-model="volunteer.country"
                      @blur="disableVolunteeringEdit(index, 'country')"
                  />
                </template>
              </p>

              <!-- 时间 (isPresent / fromDate / toDate) -->
              <template v-if="volunteer.isPresent">
                <i>
                  (
                  <span
                      v-if="!editingVolunteeringFields[index]?.fromDate"
                      @dblclick="enableVolunteeringEdit(index, 'fromDate')"
                  >
              {{ volunteer.fromDate }}
            </span>
                  <input
                      v-else
                      type="text"
                      v-model="volunteer.fromDate"
                      @blur="disableVolunteeringEdit(index, 'fromDate')"
                  />
                  - Present
                  )
                </i>
              </template>
              <template v-else>
                <i>
            <span
                v-if="!editingVolunteeringFields[index]?.fromDate"
                @dblclick="enableVolunteeringEdit(index, 'fromDate')"
            >
              {{ volunteer.fromDate }}
            </span>
                  <input
                      v-else
                      type="text"
                      v-model="volunteer.fromDate"
                      @blur="disableVolunteeringEdit(index, 'fromDate')"
                  />
                  <span v-if="volunteer.fromDate && volunteer.toDate"> - </span>
                  <span
                      v-if="!editingVolunteeringFields[index]?.toDate"
                      @dblclick="enableVolunteeringEdit(index, 'toDate')"
                  >
              {{ volunteer.toDate }}
            </span>
                  <input
                      v-else
                      type="text"
                      v-model="volunteer.toDate"
                      @blur="disableVolunteeringEdit(index, 'toDate')"
                  />
                </i>
              </template>
            </div>

            <!-- 右侧：role / name / description -->
            <div class="flex-col width75">
              <!-- role + name -->
              <template v-if="!editingVolunteeringFields[index]?.role">
                <div class="title" @dblclick="enableVolunteeringEdit(index, 'role')">
                  {{ volunteer.role }}
                  <span v-if="volunteer.role && volunteer.name"> in </span>
                  {{ volunteer.name }}
                </div>
              </template>
              <template v-else>
                <input
                    type="text"
                    class="title"
                    placeholder="Role"
                    v-model="volunteer.role"
                    @blur="disableVolunteeringEdit(index, 'role')"
                />
                <input
                    type="text"
                    class="title"
                    placeholder="Organization / Name"
                    v-model="volunteer.name"
                    @blur="disableVolunteeringEdit(index, 'role')"
                />
              </template>

              <!-- description -->
              <template v-if="!editingVolunteeringFields[index]?.description">
                <p @dblclick="enableVolunteeringEdit(index, 'description')">
                  {{ volunteer.description }}
                </p>
              </template>
              <template v-else>
          <textarea
              rows="3"
              v-model="volunteer.description"
              @blur="disableVolunteeringEdit(index, 'description')"
          ></textarea>
              </template>
            </div>
          </li>
        </ul>
      </section>
      <section v-if="model.references.length" class="resume-section">
        <h2>References</h2>
        <ul>
          <li
              v-for="(reference, index) in model.references"
              :key="index"
              class="list-block"
          >
            <div class="flex-col width25">
              <!-- company -->
              <template v-if="!editingReferencesFields[index]?.company">
                <div
                    class="title"
                    @dblclick="enableReferencesEdit(index, 'company')"
                >
                  {{ reference.company }}
                </div>
              </template>
              <template v-else>
                <input
                    type="text"
                    class="title"
                    v-model="reference.company"
                    @blur="disableReferencesEdit(index, 'company')"
                />
              </template>

              <!-- email -->
              <template v-if="!editingReferencesFields[index]?.email">
                <div @dblclick="enableReferencesEdit(index, 'email')">
                  <a :href="'mailto:' + reference.email">
                    {{ reference.email }}
                  </a>
                </div>
              </template>
              <template v-else>
                <!-- 注意：要不要保留 mailto 链接，可灵活处理 -->
                <input
                    type="text"
                    v-model="reference.email"
                    @blur="disableReferencesEdit(index, 'email')"
                />
              </template>

              <!-- phoneNumber -->
              <template v-if="!editingReferencesFields[index]?.phoneNumber">
                <div @dblclick="enableReferencesEdit(index, 'phoneNumber')">
                  {{ reference.phoneNumber }}
                </div>
              </template>
              <template v-else>
                <input
                    type="text"
                    v-model="reference.phoneNumber"
                    @blur="disableReferencesEdit(index, 'phoneNumber')"
                />
              </template>
            </div>

            <div class="flex-col width75">
              <!-- personName -->
              <template v-if="!editingReferencesFields[index]?.personName">
                <div
                    class="title"
                    @dblclick="enableReferencesEdit(index, 'personName')"
                >
                  {{ reference.personName }}
                </div>
              </template>
              <template v-else>
                <input
                    type="text"
                    class="title"
                    v-model="reference.personName"
                    @blur="disableReferencesEdit(index, 'personName')"
                />
              </template>

              <!-- description -->
              <template v-if="!editingReferencesFields[index]?.description">
                <p @dblclick="enableReferencesEdit(index, 'description')">
                  {{ reference.description }}
                </p>
              </template>
              <template v-else>
          <textarea
              rows="3"
              v-model="reference.description"
              @blur="disableReferencesEdit(index, 'description')"
          ></textarea>
              </template>
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
import {model} from '../model.js';
import {ref} from 'vue';
import ResumeSection from './ResumeSection.vue';
// 控制编辑状态
const isEditingName = ref(false);

// 双击启用编辑模式
const enableEdit = () => {
  isEditingName.value = true;
};

// 失焦或完成编辑后，退出编辑模式
const saveEdit = () => {
  isEditingName.value = false;
};
// 控制编辑状态
const isEditingSummary = ref(false);

// 双击启用编辑模式
const enableSummaryEdit = () => {
  isEditingSummary.value = true;
};

// 失焦保存内容并退出编辑模式
const saveSummaryEdit = () => {
  isEditingSummary.value = false;
};
// 用于记录某条 workExperience 的哪些字段正处于“编辑状态”
// 结构：{ [indexOfWorkItem]: { companyName: true/false, city: ..., country: ... } }
const editingWorkFields = ref({});

// 启用编辑
function enableWorkEdit(index, field) {
  if (!editingWorkFields.value[index]) {
    editingWorkFields.value[index] = {};
  }
  editingWorkFields.value[index][field] = true;
}

// 失焦退出编辑
function disableWorkEdit(index, field) {
  if (editingWorkFields.value[index]) {
    editingWorkFields.value[index][field] = false;
  }
}
// 新增：教育的编辑状态
const editingEduFields = ref({});

function enableEduEdit(index, field) {
  if (!editingEduFields.value[index]) {
    editingEduFields.value[index] = {};
  }
  editingEduFields.value[index][field] = true;
}

function disableEduEdit(index, field) {
  if (editingEduFields.value[index]) {
    editingEduFields.value[index][field] = false;
  }
}
// 新增：skills 的编辑状态
const editingSkillFields = ref({});

function enableSkillEdit(index) {
  editingSkillFields.value[index] = true;
}

function disableSkillEdit(index) {
  editingSkillFields.value[index] = false;
}
const isEditingAchievements = ref(false);

function enableAchievementsEdit() {
  isEditingAchievements.value = true;
}

function saveAchievementsEdit() {
  isEditingAchievements.value = false;
}
// 新增：projects 的编辑状态
const editingProjectFields = ref({});

function enableProjectEdit(index, field) {
  if (!editingProjectFields.value[index]) {
    editingProjectFields.value[index] = {};
  }
  editingProjectFields.value[index][field] = true;
}

function disableProjectEdit(index, field) {
  if (editingProjectFields.value[index]) {
    editingProjectFields.value[index][field] = false;
  }
}
// 新增：Awards 的编辑状态
const editingAwardFields = ref({});

function enableAwardEdit(index, field) {
  if (!editingAwardFields.value[index]) {
    editingAwardFields.value[index] = {};
  }
  editingAwardFields.value[index][field] = true;
}

function disableAwardEdit(index, field) {
  if (editingAwardFields.value[index]) {
    editingAwardFields.value[index][field] = false;
  }
}
// 新增：Certifications 的编辑状态
const editingCertFields = ref({});

function enableCertEdit(index, field) {
  if (!editingCertFields.value[index]) {
    editingCertFields.value[index] = {};
  }
  editingCertFields.value[index][field] = true;
}

function disableCertEdit(index, field) {
  if (editingCertFields.value[index]) {
    editingCertFields.value[index][field] = false;
  }
}
const editingPublications = ref({});

function enablePublicationEdit(index, field) {
  if (!editingPublications.value[index]) {
    editingPublications.value[index] = {};
  }
  editingPublications.value[index][field] = true;
}

function disablePublicationEdit(index, field) {
  if (editingPublications.value[index]) {
    editingPublications.value[index][field] = false;
  }
}
// volunteering 的编辑状态
const editingVolunteeringFields = ref({});

function enableVolunteeringEdit(index, field) {
  if (!editingVolunteeringFields.value[index]) {
    editingVolunteeringFields.value[index] = {};
  }
  editingVolunteeringFields.value[index][field] = true;
}

function disableVolunteeringEdit(index, field) {
  if (editingVolunteeringFields.value[index]) {
    editingVolunteeringFields.value[index][field] = false;
  }
}
// 1. 新增 references 的编辑状态
const editingReferencesFields = ref({});

// 2. 启用编辑
function enableReferencesEdit(index, field) {
  if (!editingReferencesFields.value[index]) {
    editingReferencesFields.value[index] = {};
  }
  editingReferencesFields.value[index][field] = true;
}

// 3. 失焦退出编辑
function disableReferencesEdit(index, field) {
  if (editingReferencesFields.value[index]) {
    editingReferencesFields.value[index][field] = false;
  }
}
</script>

<style>
input, textarea {
  margin: 0;
  border: none;
  outline: 1px dashed #aaa;
  background: transparent;
  font-size: 16px;
  width: 100%;
  padding: 2px 4px;
}
.resume-container {
  font-family: Arial, sans-serif;
  margin: 0 auto;
  padding: 20px;
  width: 8.27in;
  background-color: #fff;
  border-radius: 8px;
  overflow: auto;
}

.resume-header {
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  padding:10px 50px 0 10px;
}

.header-h1 {
  font-size: 2em;
  margin: 0;
  font-weight: bold;
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