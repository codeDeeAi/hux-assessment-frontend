<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { type IContact } from "@/types";
import { useAuthStore } from "@/stores/auth";
import { useNotify } from "@/composables/notification";

// Interfaces


// Defined

const { toast } = useNotify();

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const isLoading = ref<boolean>(false);

const router = useRouter();

const store = useAuthStore();

const contacts = ref<IContact[]>([] as IContact[]);

// Methods
const fetchContacts = async () => {

    try {
        isLoading.value = true;

        const { data: { data } } = await axios.get(`${baseUrl}/contacts`, {
            headers: {
                accepts: "application/json",
                "content-type": "application/json",
                "Authorization": `Bearer ${store.getUser.token}`
            }
        })

        contacts.value = data;

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

const deleteContact = async (id: string) => {
    try {
        isLoading.value = true;

        await axios.delete(`${baseUrl}/contact/${id}`, {
            headers: {
                accepts: "application/json",
                "content-type": "application/json",
                "Authorization": `Bearer ${store.getUser.token}`
            }
        })

        isLoading.value = false;

        toast('Data deleted', 'success');

        const deleted_index = contacts.value.findIndex((contact) => contact._id == id);

        if (deleted_index !== -1) {
            contacts.value.splice(deleted_index, 1);
        }

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

        return toast('Error fetching data', 'error');;
    }
}

onMounted(() => {
    fetchContacts();
})
</script>
<template>
    <div class="flex min-h-full w-full px-6 py-24 lg:px-8">
        <div class="relative overflow-x-auto w-full">
            <div class="w-full flex justify-end pb-2">
                <router-link :to="{ name: 'contact-create' }"
                    class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Add
                    contact</router-link>
            </div>
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            First Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Last Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Phone Number
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="contact in contacts" :key="contact._id"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {{ contact.first_name }}
                        </th>
                        <td class="px-6 py-4">
                            {{ contact.last_name }}
                        </td>
                        <td class="px-6 py-4">
                            {{ contact.phone_number }}
                        </td>
                        <td class="px-6 py-4 flex align-middle gap-3">
                            <router-link :to="{ name: 'contact-view', params: { id: contact._id } }">View</router-link>
                            <router-link :to="{ name: 'contact-edit', params: { id: contact._id } }">Edit</router-link>
                            <button type="button" class="text-red-500"
                                @click.prevent="deleteContact(contact._id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>