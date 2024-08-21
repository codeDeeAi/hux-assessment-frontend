import { ref, computed } from 'vue'

interface IErrors {
  [key: string]: string[];
}

export function useForm() {

  const errors = ref<IErrors>({} as IErrors);


  /**
   * Initialize errors
   * @param {IErrors} data 
   */
  const initErrors = (data: IErrors): void => {
    errors.value = data
  }

  /**
   * Clear all errors
   */
  const clearAllErrors = (): void => {
    for (const key in errors.value) {
      if (Object.prototype.hasOwnProperty.call(errors.value, key)) {
        errors.value[key] = [] as string[];
      }
    }
  }

  /**
   * Clear specific error
   * @param {string} key
   */
  const clearError = (key: string): void => {
    if (key in errors.value) {
      errors.value[key] = [] as string[];
    }
  }

  /**
   * Set specific error
   * @param {string} key
   */
  const setError = (key: string, error: string): void => {
    if (key in errors.value) {
      errors.value[key].push(error);
    }
  }

  /**
   * Get all errors
   * @returns {IErrors}
   */
  const getErrors = computed((): IErrors => errors.value);

  return { initErrors, clearAllErrors, clearError, setError, getErrors }
}