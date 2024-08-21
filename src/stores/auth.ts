import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface IUser {
  id: string;
  name: string;
  email: string;
  token: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser>({} as IUser);

  const getUser = computed((): IUser => user.value);

  const isLoggedIn = computed((): boolean => {
    return (Object(user.value).keys.length > 0)
  });

  const setAuth = (data: IUser) => {
    user.value = data;
  }

  const purgeAuth = (): void => {
    user.value = {} as IUser;
  }

  return {
    setAuth,
    getUser,
    purgeAuth,
    isLoggedIn,
  }
}, { persist: true })
