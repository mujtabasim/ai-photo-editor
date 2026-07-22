import axios from 'axios';
import { MOCK_USER, MOCK_PROJECTS, MOCK_SUBSCRIPTION_PLANS } from '../constants/mockData';
import { ProjectHistory, UserProfile } from '../types';

const BACKEND_BASE_URL = 'http://localhost:5000/api/v1';

// Configure standard shared Axios instance (Task 3)
const api = axios.create({
  baseURL: BACKEND_BASE_URL,
});

// Axios Request Interceptor (Task 2)
api.interceptors.request.use(
  (config) => {
    // Automatically attach development mock token
    config.headers['Authorization'] = 'Bearer mock_dev_token';
    console.log(`[Axios Interceptor] Attached Bearer mock_dev_token to: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password?: string) => {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, user: { ...MOCK_USER, email }, token: 'mock_dev_token' };
  },

  register: async (name: string, email: string) => {
    await new Promise((r) => setTimeout(r, 800));
    return { success: true, user: { ...MOCK_USER, name, email }, token: 'mock_dev_token' };
  },

  forgotPassword: async (email: string) => {
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, message: `Reset link sent to ${email}` };
  },
};

export const uploadApi = {
  uploadImage: async (fileUri: string) => {
    console.log(`[uploadApi.uploadImage] Starting upload for file: ${fileUri}`);
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'user_upload.jpg');

      // Use configured api client instance
      const res = await api.post('/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        }
      });

      if (res.data?.success) {
        const image = res.data.data.image;
        const project = res.data.data.project;
        console.log(`[uploadApi.uploadImage] Success. FileId: ${image.id}, ProjectId: ${project.id}`);
        return {
          success: true,
          imageUrl: image.storageUrl,
          fileId: image.id,
          projectId: project.id,
          dimensions: { width: image.width, height: image.height },
        };
      }
      throw new Error('Upload request did not return success state.');
    } catch (e: any) {
      console.error('[uploadApi.uploadImage] Error occurred:', e?.response?.data || e?.message || e);
      throw e; // Task 4: Remove fallback
    }
  },

  uploadMultiple: async (uris: string[]) => {
    await new Promise((r) => setTimeout(r, 1200));
    return {
      success: true,
      uploadedCount: uris.length,
      images: uris.map((uri, i) => ({ id: `batch_${i}`, url: uri })),
    };
  },
};

export const editorApi = {
  processAITool: async (toolId: string, imageUri: string, params?: Record<string, any>) => {
    console.log(`[editorApi.processAITool] Submitting AI task: ${toolId} for imageUri: ${imageUri}`);
    try {
      const imageId = params?.imageId || 'img_mock_1';
      const projectId = params?.projectId || 'proj_mock_1';

      // 1. Submit AI Processing Job using configured api instance
      const submitRes = await api.post('/ai/process', {
        imageId,
        projectId,
        tool: toolId,
        params,
      });

      if (submitRes.data?.success) {
        const jobId = submitRes.data.data.id;
        console.log(`[editorApi.processAITool] Job submitted. JobId: ${jobId}. Polling status...`);

        // 2. Poll job status
        for (let i = 0; i < 15; i++) {
          await new Promise((r) => setTimeout(r, 500));
          const statusRes = await api.get(`/ai/jobs/${jobId}`);

          if (statusRes.data?.success) {
            const job = statusRes.data.data;
            console.log(`[editorApi.processAITool] Polling attempt ${i + 1}. Job Status: ${job.status}`);
            
            if (job.status === 'COMPLETED') {
              const cacheBusterUrl = `${job.outputImageUrl}?t=${Date.now()}`;
              console.log(`[editorApi.processAITool] Success! outputImageUrl: ${cacheBusterUrl}`);
              return {
                success: true,
                processedImageUrl: cacheBusterUrl,
                toolUsed: toolId,
                processingTimeMs: job.processingTimeMs || 1000,
              };
            } else if (job.status === 'FAILED') {
              throw new Error(job.errorMessage || 'AI process failed');
            }
          }
        }
      }
      throw new Error('AI processing timed out');
    } catch (e: any) {
      console.error('[editorApi.processAITool] Error occurred:', e?.response?.data || e?.message || e);
      throw e; // Task 4: Remove fallback
    }
  },

  saveExport: async (project: Partial<ProjectHistory>) => {
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      projectId: project.id || `proj_${Date.now()}`,
      savedUrl: project.processedUrl || project.originalUrl || '',
    };
  },
};

export const historyApi = {
  getHistory: async () => {
    try {
      const res = await api.get('/projects');
      return res.data?.data || MOCK_PROJECTS;
    } catch (e) {
      return MOCK_PROJECTS;
    }
  },

  deleteProject: async (id: string) => {
    try {
      const res = await api.delete(`/projects/${id}`);
      return { success: res.data?.success, id };
    } catch (e) {
      return { success: true, id };
    }
  },
};

export const subscriptionApi = {
  getPlans: async () => {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_SUBSCRIPTION_PLANS;
  },

  purchasePlan: async (planId: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    return { success: true, planId, status: 'active' };
  },
};

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_USER;
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    try {
      const res = await api.put('/profile', updates);
      return res.data?.data || { ...MOCK_USER, ...updates };
    } catch (e) {
      return { ...MOCK_USER, ...updates };
    }
  },
};
