<template>
  <form>
    <input v-model="signup_email" type="email" placeholder="Enter your e-mail" class="w-full input"> 
    <input v-model="signup_password" type="password" placeholder="Choose a password" class="w-full input" autocomplete="false"> 
    <input v-model="signup_confirm_password" type="password" placeholder="Confirm your password" class="w-full input" autocomplete="false"> 
    <button type="submit" >CREATE ACCOUNT</button>
  </form>

</template>

<script setup lang="ts">

  const signup_email = ref("");
  const signup_password = ref("");
  const signup_confirm_password = ref("");

  clearFieldAlertOnTyping({signup_email, signup_password, signup_confirm_password})
  
  ifNoUIError({signup_email, signup_password, signup_confirm_password})


</script>