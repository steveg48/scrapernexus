interface JobPostingData {
  title?: string;
  description?: string;
  skills?: Array<{ skill_id: number; skill_name: string }>;
  budget?: {
    type: 'hourly' | 'fixed';
    fromRate?: string;
    toRate?: string;
    fixedRate?: string;
  };
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
      const stored = sessionStorage.getItem('job_posting_draft');
      if (stored) {
        this.data = JSON.parse(stored);
      }
      this.initialized = true;
    } catch (error) {
      console.error('Error accessing sessionStorage:', error);
      this.data = {};
      this.initialized = true;
    }
  }

  private async persistToStorage(): Promise<void> {
    if (!this.isClient) return;
    
    try {
      sessionStorage.setItem('job_posting_draft', JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }

  public async saveField<T>(key: string, value: T): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
    this.data[key] = value;
    await this.persistToStorage();
  }

  public async getField<T>(key: string): Promise<T | undefined> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.data[key] as T;
  }

  public async getAllData(): Promise<JobPostingData> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.data as JobPostingData;
  }

  public async clear(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
    this.data = {};
    if (this.isClient) {
      sessionStorage.removeItem('job_posting_draft');
    }
  }
}

export function getJobPostingStore(): JobPostingStore {
  return JobPostingStore.getInstance();
}
