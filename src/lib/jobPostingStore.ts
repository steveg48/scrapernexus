interface JobPostingData {
  title?: string;
  description?: string;
  skills?: string[];
  scope?: string;
  budget?: {
    type: string;
    amount: number;
  };
  location?: {
    type: string;
    locations?: string[];
  };
}

const STORAGE_KEY = 'job_posting_draft';

export const jobPostingStore = {
  // Save data for a specific field
  saveField: (field: keyof JobPostingData, value: any) => {
    try {
      const currentData = jobPostingStore.getAllData();
      const newData = {
        ...currentData,
        [field]: value,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving job posting data:', error);
    }
  },

  // Get data for a specific field
  getField: <T>(field: keyof JobPostingData): T | undefined => {
    try {
      const data = jobPostingStore.getAllData();
      return data[field] as T;
    } catch (error) {
      console.error('Error getting job posting field:', error);
      return undefined;
    }
  },

  // Get all stored data
  getAllData: (): JobPostingData => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting all job posting data:', error);
      return {};
    }
  },

  // Clear all stored data
  clearData: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing job posting data:', error);
    }
  }
};
