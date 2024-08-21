<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { type IContact } from "@/types";
import { useAuthStore } from "@/stores/auth";
import { useNotify } from "@/composables/notification";

// Interfaces


// Defined

const { toast } = useNotify();

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const isLoading = ref<boolean>(false);

const router = useRouter();

const route = useRoute();

const store = useAuthStore();

const contact = ref<IContact>({} as IContact);

// Methods
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

        contact.value = data;

        isLoading.value = false;

        toast('Data fetched', 'success');

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

onMounted(() => {
    fetchContact();
})
</script>
<template>
    <div class="flex min-h-full w-full px-6 py-24 lg:px-8">

        <div
            class="w-full max-w-sm m-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

            <div class="flex flex-col items-center py-10">
                <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{{ `${contact.first_name}
                    ${contact.last_name}` }}</h5>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ contact.phone_number }}</span>
                <div class="flex mt-4 md:mt-6">
                    <router-link :to="{ name: 'contact-edit', params: { id: route.params.id } }"
                        class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Edit</router-link>
                    <router-link :to="{ name: 'contacts' }"
                        class="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">All
                        Contacts</router-link>
                </div>
            </div>
        </div>


    </div>
</template>