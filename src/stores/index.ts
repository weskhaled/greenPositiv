export const token: Ref<string | null> = useStorage('token', null)
export const currentUser: Ref<any | null> = ref(null)
export const isAuth = ref(null)
export const isAuthenticated = computed(() => token.value && token.value?.length)
