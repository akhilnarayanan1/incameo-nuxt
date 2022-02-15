<template>
    <div>
        {{ firebaseUser?.uid }}
        <button @click="instagramConnect">connect instagram</button>
        <button @click="facebookConnect">connect facebook</button>
    </div>
</template>

<script setup lang="ts">
    const firebaseUser = getUserData();

    const config = useRuntimeConfig();

    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=400,height=600,left=100,top=100`;

    const instagramConnect = () => {
        const instagram_window = window.open(`https://www.instagram.com/oauth/authorize?client_id=${config.instagramClientId}&`+
            `redirect_uri=${config.instagramRedirectUri}&scope=user_profile,user_media&response_type=code`,
            '_blank', params);

        const timer = setInterval(() => {
            const socialmedia_instagram = localStorage.getItem("socialmedia_instagram");
            localStorage.removeItem("socialmedia_instagram");

            if (instagram_window.closed) {
                clearInterval(timer);
                socialmedia_instagram ? alert(socialmedia_instagram) : alert('Closed too early')
            }
        }, 3000);
    }

    const facebookConnect = () => {
        const facebook_window = window.open(`https://www.facebook.com/v12.0/dialog/oauth?client_id=${config.facebookClientId}&`+
            `redirect_uri=${config.facebookRedirectUri}&scope=public_profile,email,instagram_basic,`+
            `read_insights,instagram_manage_insights,pages_show_list,pages_read_engagement&`+
            `response_type=code&display=popup&auth_type=rerequest`,
            '_blank', params);

        const timer = setInterval(() => {
            const socialmedia_facebook = localStorage.getItem("socialmedia_facebook");
            localStorage.removeItem("socialmedia_facebook");

            if (facebook_window.closed) {
                clearInterval(timer);
                socialmedia_facebook ? alert(socialmedia_facebook) : alert('Closed too early')
            }
        }, 3000);
    }
</script>