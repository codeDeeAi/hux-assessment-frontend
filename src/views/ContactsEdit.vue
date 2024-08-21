<script setup lang="ts">
import axios from "axios";
import { ref, watch, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useForm } from "@/composables/form";
import { useRouter, useRoute } from "vue-router";
import { useNotify } from "@/composables/notification";

// Interfaces
interface IForm {
    first_name: string;
    last_name: string;
    phone_number: string;
}

// Defined
const { initErrors, clearAllErrors, setError, getErrors } = useForm();

const { toast } = useNotify();

const router = useRouter();

const route = useRoute();

const store = useAuthStore();

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const isLoading = ref<boolean>(false);

const form = ref<IForm>({
    first_name: "",
    last_name: "",
    phone_number: "",
});

// Methods
const validate = (): boolean => {
    const { first_name, last_name, phone_number } = form.value;

    let count = 0;

    if (first_name.trim().length === 0) {
        setError('first_name', 'first_name is required')
        count += 1
    }

    if (last_name.trim().length === 0) {
        setError('last_name', 'last_name is required')
        count += 1
    }

    if (phone_number.trim().length === 0) {
        setError('phone_number', 'phone_number is required')
        count += 1
    }

    return (count === 0) ? true : false;
};

const submit = async () => {

    const { id } = route.params;

    if (!id)
        router.push({ name: '404' })

    if (!validate()) return;

    try {
        isLoading.value = true;

        await axios.patch(`${baseUrl}/contact/${id}`, form.value, {
            headers: {
                accepts: "application/json",
                "content-type": "application/json",
                "Authorization": `Bearer ${store.getUser.token}`
            }
        })

        toast('Contact updated successfully', 'success');

        router.push({ name: 'contact-view', params: { id } })

        isLoading.value = false;
    } catch (error: any) {

        isLoading.value = false;

        const { response } = error;

        if (response.data) {

            const { code, error, message, errors } = response.data;

            if (code == 401) {

                store.purgeAuth();

                router.push({ name: 'home' })
            }

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

        return toast('Error saving contact', 'error');;
    }
}

const fetchContact = async () => {

    const { id } = route.params;

    if (!id)
        router.push({ name: '404' })

    try {
        isLoading.value = true;

        const { data: { data } } = await axios.get(`${baseUrl}/contact/${id}`, {
            headers: {
                accepts: "application/json",
                "content-type": "application/json",
                "Authorization": `Bearer ${store.getUser.token}`
            }
        })

        const { first_name, last_name, phone_number } = data;

        form.value = {
            first_name,
            last_name,
            phone_number
        }

        isLoading.value = false;

        toast('Contact fetched', 'success');

    } catch (error: any) {

        isLoading.value = false;

        const { response } = error;

        if (response.data) {

            const { code, error, message, errors } = response.data;

            if (code == 401) {

                store.purgeAuth();

                router.push({ name: 'home' })
            } else {

                toast(message || error, 'error');
            }

            return
        }

        return toast('Error fetching data', 'error');
    }
};

// Watcher
watch(form, () => {
    if (validate()) {
        clearAllErrors();
    }
}, { deep: true })

// On page load
initErrors({
    first_name: [],
    last_name: [],
    phone_number: []
});

onMounted(() => {
    fetchContact();
})

</script>

<template>
    <div>
        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Edit Contact
                </h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6">
                    <div>
                        <label for="first_name" class="block text-sm font-medium leading-6 text-gray-900">First
                            Name</label>
                        <div class="mt-2">
                            <input id="first_name" first_name="first_name" type="text" autocomplete="first_name"
                                required v-model="form.first_name"
                                class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        </div>
                        <span class="mt-1 text-sm text-red-500"
                            v-if="getErrors.last_name && getErrors.first_name.length > 0">{{
                                getErrors.first_name[0] }}</span>
                    </div>

                    <div>
                        <label for="last_name" class="block text-sm font-medium leading-6 text-gray-900">Last Name
                            address</label>
                        <div class="mt-2">
                            <input id="last_name" first_name="last_name" type="text" autocomplete="last_name" required
                                v-model="form.last_name"
                                class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        </div>
                        <span class="mt-1 text-sm text-red-500"
                            v-if="getErrors.last_name && getErrors.last_name.length > 0">{{
                                getErrors.last_name[0] }}</span>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                            <label for="phone_number" class="block text-sm font-medium leading-6 text-gray-900">Phone
                                Number</label>
                        </div>
                        <div class="mt-2">
                            <input id="phone_number" first_name="phone_number" type="telephone"
                                autocomplete="current-phone_number" required v-model="form.phone_number"
                                class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        </div>
                        <span class="mt-1 text-sm text-red-500"
                            v-if="getErrors.phone_number && getErrors.phone_number.length > 0">{{
                                getErrors.phone_number[0] }}</span>
                    </div>

                    <div>
                        <button type="button" @click.prevent="submit()"
                            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            <div v-if="isLoading" role="status">
                                <svg aria-hidden="true"
                                    class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                            <span v-else>Edit contact</span>
                        </button>
                    </div>
                </form>

                <p class="mt-10 text-center text-sm text-gray-500">
                    <router-link :to="{ name: 'contacts' }"
                        class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Go back</router-link>
                </p>
            </div>
        </div>
    </div>

</template>
