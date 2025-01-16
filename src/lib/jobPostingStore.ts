interface JobPostingData {
  title?: string;
  description?: string;
  skills?: Array<{ skill_id: string; name: string }>;
  project_scope?: string;
  frequency?: string;
  budget?: {
    type: 'hourly' | 'fixed';
    fromRate?: string;
    toRate?: string;
    fixedRate?: string;
  };
  project_location?: string;
}

class JobPostingStore {
  private static instance: JobPostingStore;
  private data: { [key: string]: any } = {};
  private isClient: boolean;
  private initialized: boolean = false;

  private constructor() {
    this.isClient = typeof window !== 'undefined';
    this.initialized = false;
  }

  public static getInstance(): JobPostingStore {
    if (!JobPostingStore.instance) {
      JobPostingStore.instance = new JobPostingStore();
    }
    return JobPostingStore.instance;
  }

  public async initialize(): Promise<void> {
    if (!this.isClient || this.initialized) return;
    
    try {
      const stored = localStorage.getItem('job_posting_draft');
      if (stored) {
        this.data = JSON.parse(stored);
      }
      this.initialized = true;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      this.data = {};
      this.initialized = true;
    }
  }

  private async persistToStorage(): Promise<void> {
    if (!this.isClient) return;
    
    try {
      localStorage.setItem('job_posting_draft', JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  public async saveField<T>(key: keyof JobPostingData, value: T): Promise<void> {
    if (!this.isClient) {
      console.warn('Attempting to save data in server context');
      return;
    }
    
    await this.initialize();
    this.data[key] = value;
    await this.persistToStorage();
  }

  public async getField<T>(key: keyof JobPostingData): Promise<T | undefined> {
    if (!this.isClient) {
      console.warn('Attempting to get data in server context');
      return undefined;
    }
    
    await this.initialize();
    return this.data[key] as T;
  }

  public async getAllData(): Promise<JobPostingData> {
    if (!this.isClient) {
      console.warn('Attempting to get all data in server context');
      return {};
    }
    
    await this.initialize();
    return { ...this.data };
  }

  public async clearData(): Promise<void> {
    if (!this.isClient) {
      console.warn('Attempting to clear data in server context');
      return;
    }
    
    this.data = {};
    try {
      localStorage.removeItem('job_posting_draft');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    this.initialized = false;
  }
}

export const getJobPostingStore = () => JobPostingStore.getInstance();
