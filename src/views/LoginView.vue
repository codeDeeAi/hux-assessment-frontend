<script setup lang="ts">
import axios from "axios";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "@/composables/form";
import { useNotify } from "@/composables/notification";
import { useAuthStore, type IUser } from "@/stores/auth";

// Interfaces
interface IForm {
  email: string;
  password: string;
}

// Defined
const { initErrors, clearAllErrors, setError, getErrors } = useForm();

const { toast } = useNotify();

const router = useRouter();

const store = useAuthStore();

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const isLoading = ref<boolean>(false);

const form = ref<IForm>({
  email: "",
  password: "",
});

// Methods
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const validate = (): boolean => {
  const { email, password } = form.value;

  let count = 0;

  if (email.trim().length === 0) {
    setError('email', 'Email is required')
    count += 1
  }

  if (!isValidEmail(email)) {
    setError('email', 'Email should be a valid email type')
    count += 1
  }

  if (password.trim().length === 0) {
    setError('password', 'Password is required')
    count += 1
  }

  return (count === 0) ? true : false;
};

const submit = async () => {

  if (!validate()) return;

  try {
    isLoading.value = true;

    const { data: { data } } = await axios.post(`${baseUrl}/login`, form.value, {
      headers: {
        accepts: "application/json",
        "content-type": "application/json"
      }
    });

    isLoading.value = false;

    store.setAuth(data as IUser)

    router.push({ name: 'contacts' });

  } catch (error: any) {

    isLoading.value = false;

    const { response } = error;

    if (response.data) {

      const { code, error, message, errors } = response.data;

      if (code == 422) {
        toast(message || error, 'error');

        errors.forEach(({ path, msg }: any) => {
          setError(path as string, msg as string);
        });

      } else {

        toast(message || error, 'error');
      }

      return
    }

    return toast('Error signing in', 'error');;
  }
}

// Watcher
watch(form, () => {
  if (validate()) {
    clearAllErrors();
  }
}, { deep: true })

// On page load
initErrors({
  email: [],
  password: []
});

</script>

<template>
  <div>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div class="mt-2">
              <input id="email" name="email" type="email" autocomplete="email" required v-model="form.email"
                class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
            <span class="mt-1 text-sm text-red-500" v-if="getErrors.email && getErrors.email.length > 0">{{
              getErrors.email[0] }}</span>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
              <div class="text-sm">
                <a href="javascript:void(0)" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot
                  password?</a>
              </div>
            </div>
            <div class="mt-2">
              <input id="password" name="password" type="password" autocomplete="current-password" required
                v-model="form.password"
                class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
            <span class="mt-1 text-sm text-red-500" v-if="getErrors.password && getErrors.password.length > 0">{{
              getErrors.password[0] }}</span>
          </div>

          <div>
            <button type="button" @click.prevent="submit()"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <div v-if="isLoading" role="status">
                <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor" />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill" />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
              <span v-else>Sign In</span>
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500">
          Not a member?
          <router-link :to="{ name: 'register' }"
            class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Register here</router-link>
        </p>
      </div>
    </div>
  </div>

</template>
