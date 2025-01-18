

  <section v-if="model.education.length" class="resume-section">
    <h2>EDUCATION</h2>
    <ul>
      <li
          v-for="(edu, index) in model.education"
          :key="index"
          class="list-block"
      >
        <div class="flex-col width25">
          <template v-if="!editingEduFields[index]?.institutionName">
            <div
                class="title"
                @dblclick="enableEduEdit(index, 'institutionName')"
            >
              {{ edu.institutionName }}
            </div>
          </template>
          <template v-else>
            <input
                type="text"
                class="title"
                v-model="edu.institutionName"
                v-focus
                @blur="disableEduEdit(index, 'institutionName')"

            />
          </template>

          <!-- city & country -->
          <p>
            <!-- city -->
            <i v-if="!editingEduFields[index]?.city"
               @dblclick="enableEduEdit(index, 'city')">
              {{ edu.city }}
            </i>
            <input
                v-else
                type="text"
                v-model="edu.city"
                v-focus
                @blur="disableEduEdit(index, 'city')"
            />
            <span v-if="edu.city && edu.country">,</span>

            <!-- country -->
            <i v-if="!editingEduFields[index]?.country"
               @dblclick="enableEduEdit(index, 'country')">
              {{ edu.country }}
            </i>
            <input
                v-else
                type="text"
                v-model="edu.country"
                v-focus
                @blur="disableEduEdit(index, 'country')"
            />
          </p>

          <!-- 日期：isPresent / fromDate / toDate -->
          <i v-if="edu.isPresent">
            (<span
              v-if="!editingEduFields[index]?.fromDate"
              @dblclick="enableEduEdit(index, 'fromDate')"
          >
          {{ edu.fromDate }}
        </span>
            <input
                v-else
                type="text"
                v-model="edu.fromDate"
                v-focus
                @blur="disableEduEdit(index, 'fromDate')"
            />
            - Present)
          </i>
          <i v-else>
        <span
            v-if="!editingEduFields[index]?.fromDate"
            @dblclick="enableEduEdit(index, 'fromDate')"
        >
          {{ edu.fromDate }}
        </span>
            <input
                v-else
                type="text"
                v-model="edu.fromDate"
                v-focus
                @blur="disableEduEdit(index, 'fromDate')"
            />
            <span v-if="edu.fromDate && edu.toDate">-</span>
            <span
                v-if="!editingEduFields[index]?.toDate"
                @dblclick="enableEduEdit(index, 'toDate')"
            >
          {{ edu.toDate }}
        </span>
            <input
                v-else
                type="text"
                v-model="edu.toDate"
                v-focus
                @blur="disableEduEdit(index, 'toDate')"
            />
          </i>
        </div>

        <div class="width75 flex-col">
          <template v-if="!editingEduFields[index]?.degree">
            <div
                class="title"
                @dblclick="enableEduEdit(index, 'degree')"
            >
              {{ edu.degree }}
            </div>
          </template>
          <template v-else>
            <input
                type="text"
                class="title"
                v-model="edu.degree"
                v-focus
                @blur="disableEduEdit(index, 'degree')"
            />
          </template>

          <template v-if="!editingEduFields[index]?.fieldOfStudy">
            <div
                class="title"
                @dblclick="enableEduEdit(index, 'fieldOfStudy')"
            >
              {{ edu.fieldOfStudy }}
            </div>
          </template>

          <span v-if="edu.degree && edu.fieldOfStudy">
            in
          </span>

          <template v-else>
            <input
                type="text"
                class="title"
                v-model="edu.fieldOfStudy"
                v-focus
                @blur="disableEduEdit(index, 'fieldOfStudy')"
            />
          </template>

          <!-- description -->
          <template v-if="!editingEduFields[index]?.description">
                  <span v-html="formattedDescription(edu.description)"  @dblclick="enableEduEdit(index, 'description')">
                  </span>
          </template>
          <template v-else>
        <textarea
            rows="3"
            v-model="edu.description"
            v-focus
            @blur="disableEduEdit(index, 'description')"
        ></textarea>
          </template>
        </div>
      </li>
    </ul>
    <ul>
      <li v-for="(edu, index) in model.education" :key="index" class="list-block">
        <div class="flex-col width25">
          <div class="title">{{ edu.institutionName }}</div>
          <p><I>{{ edu.city }}, {{ edu.country }}</I></p>

          <I v-if="edu.isPresent">({{ edu.fromDate }} - Present)</I>
          <I v-else>{{ edu.fromDate }} - {{ edu.toDate }}</I>
        </div>
        <div class="width75 flex-col">
          <div class="title">{{ edu.degree }} in {{ edu.fieldOfStudy }} <span v-if="edu.grade">(Grade: {{
              edu.grade
            }})</span></div>
          <p>{{ edu.description }}</p>
        </div>
      </li>
    </ul>
  </section>


<script setup lang="ts">
</script>