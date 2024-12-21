<template>
  <div class="editor-panel">
    <h2>Personal Information</h2>
    <div class="input-group">
      <label>First Name</label>
      <input type="text" v-model="form.firstName" placeholder="First Name" />

      <label>Last Name</label>
      <input type="text" v-model="form.lastName" placeholder="Last Name" />

      <label>Phone Number</label>
      <input type="text" v-model="form.phoneNumber" placeholder="Phone Number" />

      <label>Email</label>
      <input type="text" v-model="form.email" placeholder="Email" />
    </div>

    <div class="dropdown-sections">
      <button>Summary</button>
      <button>Work Experience</button>
      <button>Education</button>
      <button>Skills</button>
      <button>Projects</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
      },
    };
  },
};
</script>

<style>
.editor-panel {
  width: 30%;
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.input-group label {
  display: block;
  margin: 10px 0 5px;
}
.input-group input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
.dropdown-sections button {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  background-color: #dfe6e9;
  border: none;
  cursor: pointer;
}
</style>