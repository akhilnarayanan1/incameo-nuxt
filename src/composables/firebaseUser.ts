import { onAuthStateChanged, Auth, User } from 'firebase/auth';

const firebaseUser = () => useState<User>('firebaseUser');

export const getUserData = () => {
    const { $firebaseAuth } = useNuxtApp();
    onMounted(() => {
        onAuthStateChanged($firebaseAuth, (currentUser) => {
            if (currentUser) {
                firebaseUser().value = currentUser
            } else{
                firebaseUser().value = null
            }
        })
    })
    return firebaseUser();
}

export const getUserDataPromised = (): Promise<User> => {
    const { $firebaseAuth } = useNuxtApp();
    return new Promise((resolve, reject) => {
        try {
            const unsubscribe = onAuthStateChanged($firebaseAuth, (user: User) => {
                resolve(user);
                unsubscribe();
            })
        } catch(err) {
            reject(err)
        }
    })
}