import { useToast, type ToastPosition, type ToastType } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

export function useNotify() {

    const $toast = useToast();

    /**
     * Call Toast
     * @param {string} message 
     * @param {ToastType} type 
     * @param {number} duration 
     * @param {ToastPosition}position 
     */
    const toast = (message: string, type: ToastType = 'success', duration = 3000, position: ToastPosition = 'top-right') => {

        $toast.success(message, {
            type,
            duration,
            position
        });
    }


    return { toast }
}