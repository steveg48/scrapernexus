interface JobPostingData {
  title?: string;
  description?: string;
  skills?: string[];
  scope?: {
    scope: string;
    duration: string;
  };
  budget?: {
    type: string;
    amount: number;
  };
  project_location?: 'US only' | 'Worldwide';
  location?: {
    type: string;
    locations?: string[];
  };
}

const STORAGE_KEY = 'job_posting_draft';

const isClient = typeof window !== 'undefined';

export const jobPostingStore = {
  // Save data for a specific field
  saveField: (field: keyof JobPostingData, value: any) => {
    if (!isClient) return;
    
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
    if (!isClient) return undefined;
    
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
    if (!isClient) return {};
    
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
    if (!isClient) return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing job posting data:', error);
    }
  }
};
