<template>
    <div>
        <div v-if="loading.state==0">
            Loading....
        </div>
        <div v-else>
            Done
        </div>
    </div>
</template>

<script setup lang="ts">
    import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, orderBy, limit, updateDoc, DocumentReference, DocumentData  } from "firebase/firestore"; 
    // import _ from "lodash";
    import { filter, pickBy, has, negate, isEmpty } from "lodash";
    
    const { $firebaseDB } = useNuxtApp();
    const route = useRoute();
    const { code } = route.query;

    const config = useRuntimeConfig();

    let loading: { state: number } = reactive({state: 0})
    let message: { error: string, output:string } = reactive({error: "", output: ""})

    const {data, pending, refresh, error} = await useFetch(`${config.facebookVerifyUrl}?code=${code}`);


    onMounted(async () => {

        if (error.value) {
            loading.state = -1;
            message.error = "error fetching data";
            localStorage.setItem("socialmedia_facebook", `${JSON.stringify(message)}`);
            window.close();
        } 

        const user = await getUserDataPromised();

        const all_accounts = data.value['data'] || []

        const connected_accounts = filter(all_accounts.map((accounts) => ({
            ...pickBy(accounts, () => has(accounts, 'instagram_business_account')),
        })), negate(isEmpty));

        console.log(connected_accounts)
        
        if (connected_accounts.length > 0) {
            connected_accounts.map(async (account)=>{
                const q = query(
                    collection($firebaseDB, "facebook"), 
                    where("userid", "==", user?.uid || ""), 
                    where("id", "==", `${account['id'] || ""}`),
                    orderBy("updatedAt", "desc"), 
                    limit(1)
                );

                let documentRef: DocumentReference<DocumentData>;

                const querySnapshot = await getDocs(q);
                if(querySnapshot.size>0){
                    documentRef = doc($firebaseDB, "facebook", querySnapshot.docs[0].id)
                } else {
                    documentRef = doc(collection($firebaseDB, "facebook"));
                }
                setDoc(documentRef, {
                    ...account,
                    userid: user?.uid || "",
                    updatedAt: serverTimestamp(),
                }, { merge:true })
                .then(() => {
                    loading.state = 1;
                    message.output = "Successfully connected to Facebook";
                    localStorage.setItem("socialmedia_facebook", `${JSON.stringify(message)}`);
                    window.close();
                })
                .catch((error)=>{
                    loading.state = -1;
                    message.error = error.message;
                    localStorage.setItem("socialmedia_facebook", `${JSON.stringify(message)}`);
                    window.close();
                });
            })
            
        } else {
            loading.state = -1;
            message.error = "No Creator/Business Instagram Account Found.";
            localStorage.setItem("socialmedia_facebook", `${JSON.stringify(message)}`);
            window.close();
        }
    })
    

    
    
    

</script>