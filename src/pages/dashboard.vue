<template>
    <div>
        {{ firebaseUser }}
        <button @click="instagramConnect">connect instagram</button>
    </div>
</template>

<script setup lang="ts">
    const firebaseUser = getUserData();

    const config = useRuntimeConfig();

    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=400,height=600,left=100,top=100`;

    const instagramConnect = () => {
        window.open(`https://www.instagram.com/oauth/authorize?client_id=${config.instagramClientId}&`+
            `redirect_uri=${config.instagramRedirectUri}&scope=user_profile,user_media&response_type=code`,
            '_blank', params);
    }
</script>