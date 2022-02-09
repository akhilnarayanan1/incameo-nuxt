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
    import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, orderBy, limit, updateDoc, DocumentReference, DocumentData  } from "firebase/firestore"; 

    const { $firebaseDB } = useNuxtApp();
    const route = useRoute();
    const { code } = route.query;

    const config = useRuntimeConfig();

    interface InstagramResponse {
        username: string, 
        token_type: string,
        media_count: number, 
        id: string, 
        expires_in: number,
        account_type: string, 
        access_token: string
    }

    let loading: { state: number } = reactive({state: 0})
    let message: { error: string, output:string } = reactive({error: "", output: ""})

    const {data, pending, refresh, error} = await useFetch(`${config.instagramVerifyUrl}?code=${code}`);


    if (error.value) {
        loading.state = -1;
        message.error = "error fetching data";
    } else {
        onMounted(async () => {
            const user = await getUserDataPromised();

            const q = query(
                collection($firebaseDB, "instagram"), 
                where("userid", "==", user?.uid || ""), 
                where("id", "==", `${data.value['id'] || ""}`),
                orderBy("updatedAt", "desc"), 
                limit(1)
            );

            let documentRef: DocumentReference<DocumentData>;

            const querySnapshot = await getDocs(q);
            if(querySnapshot.size>0){
                documentRef = doc($firebaseDB, "instagram", querySnapshot.docs[0].id)
            } else {
                documentRef = doc(collection($firebaseDB, "instagram"));
            }
            setDoc(documentRef, {
                ...data.value,
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
    }

    
    
    

</script>