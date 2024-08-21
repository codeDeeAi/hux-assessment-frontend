import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core';

export interface IUser {
  id: string;
  name: string;
  email: string;
  token: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = useStorage<IUser>('auth-user', {} as IUser);

  const getUser = computed((): IUser => user.value);

  const isLoggedIn = computed((): boolean => {
    return Object.keys(user.value).length > 0;
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
});
