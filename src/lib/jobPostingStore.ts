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

class JobPostingStore {
  private data: { [key: string]: any } = {};
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
    this.initializeFromStorage();
  }

  private initializeFromStorage() {
    if (this.isClient) {
      try {
        const stored = localStorage.getItem('job_posting_draft');
        if (stored) {
          this.data = JSON.parse(stored);
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        // Fallback to memory-only storage
        this.data = {};
      }
    }
  }

  private persistToStorage() {
    if (this.isClient) {
      try {
        localStorage.setItem('job_posting_draft', JSON.stringify(this.data));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }

  saveField<T>(key: keyof JobPostingData, value: T): void {
    this.data[key] = value;
    this.persistToStorage();
  }

  getField<T>(key: keyof JobPostingData): T | undefined {
    return this.data[key] as T;
  }

  getAllData(): JobPostingData {
    return { ...this.data };
  }

  clearData(): void {
    this.data = {};
    if (this.isClient) {
      try {
        localStorage.removeItem('job_posting_draft');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  }
}

export const jobPostingStore = new JobPostingStore();
