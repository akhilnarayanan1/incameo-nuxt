<template>
    <div>
        <button @click="signupFacebook">FACEBOOK</button>
        <button @click="logout">logout</button>
    </div>
</template>

<script setup lang="ts">
    import { signInWithPopup, FacebookAuthProvider, signOut } from "firebase/auth";
    import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 

    const provider = new FacebookAuthProvider();

    const { $firebaseAuth, $firebaseDB } = useNuxtApp();
    
    provider.setCustomParameters({
        'display': 'popup',
        // 'auth_type': 'reauthenticate'
    });

    const logout = async () => {
        signOut($firebaseAuth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    };

    const signupFacebook = () => {
       signInWithPopup($firebaseAuth, provider)
        .then(async (result) => {
            const user = result.user;
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            await setDoc(doc($firebaseDB, "users", user.uid), {
                name: user.displayName,
                createdAt: serverTimestamp(),
            }, { merge: true });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = FacebookAuthProvider.credentialFromError(error);
        });
    };

    
</script>