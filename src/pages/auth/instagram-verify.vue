<template>
    <div>
        <div v-if="loading.state==0">
            Loading....
        </div>
        <div v-else-if="loading.state==1">
            {{ message.output }}
        </div>
        <div v-else-if="loading.state==-1">
            {{ message.error }}
        </div>
    </div>
</template>

<script setup lang="ts">
    import { doc, setDoc, serverTimestamp, Timestamp, collection, addDoc } from "firebase/firestore"; 

    const { $firebaseDB } = useNuxtApp();
    const route = useRoute();
    const { code } = route.query;

    const config = useRuntimeConfig();

    let loading: { state: number } = reactive({state: 0})
    let message: { error: string, output:string } = reactive({error: "", output: ""})

    const response = await useFetch(`${config.instagramVerifyUrl}?code=${code}`);

    onMounted(async () => {
        const user = await getUserDataPromised();
        const instagramDocRef = doc(collection($firebaseDB, "instagram"));
        setDoc(instagramDocRef, {
            ...response.data.value,
            userid: user?.uid || "",
            updatedAt: serverTimestamp(),
        }, { merge:true })
        .then(() => {
            loading.state = 1;
            message.output = "Successfully connected to instagram";
        })
        .catch((error)=>{
            loading.state = -1;
            message.error = error.message;
        });
    })
    
    

</script>