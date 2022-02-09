<template>
    <div>
        {{ firebaseUser }}
        <button @click="instagramConnect">connect instagram</button>
        <button @click="facebookConnect">connect facebook</button>
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

    const facebookConnect = () => {
        window.open(`https://www.facebook.com/v12.0/dialog/oauth?client_id=${config.facebookClientId}&`+
            `redirect_uri=${config.facebookRedirectUri}&scope=public_profile,email,instagram_basic,`+
            `read_insights,instagram_manage_insights,pages_show_list,pages_read_engagement&`+
            `response_type=code&display=popup&auth_type=rerequest`,
            '_blank', params);
    }
</script>