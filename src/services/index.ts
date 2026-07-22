import axios from 'axios';
import { MOCK_USER, MOCK_PROJECTS, MOCK_SUBSCRIPTION_PLANS } from '../constants/mockData';
import { ProjectHistory, UserProfile } from '../types';

const BACKEND_BASE_URL = 'http://localhost:5000/api/v1';

export const authApi = {
  login: async (email: string, password?: string) => {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, user: { ...MOCK_USER, email }, token: 'mock_jwt_token' };
  },

  register: async (name: string, email: string) => {
    await new Promise((r) => setTimeout(r, 800));
    return { success: true, user: { ...MOCK_USER, name, email }, token: 'mock_jwt_token' };
  },

  forgotPassword: async (email: string) => {
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, message: `Reset link sent to ${email}` };
  },
};

export const uploadApi = {
  uploadImage: async (fileUri: string) => {
    try {
      // 1. Fetch local image URI (data URL, blob URL, or local file) and convert to Blob
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // 2. Prepare multipart form data payload
      const formData = new FormData();
      formData.append('image', blob, 'user_upload.jpg');

      // 3. Post to backend upload endpoint
      const res = await axios.post(`${BACKEND_BASE_URL}/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer mock_token'
        }
      });

      if (res.data?.success) {
        const image = res.data.data.image;
        const project = res.data.data.project;
        return {
          success: true,
          imageUrl: image.storageUrl,
          fileId: image.id,
          projectId: project.id,
          dimensions: { width: image.width, height: image.height },
        };
      }
    } catch (e: any) {
      console.warn('[uploadApi] Multipart file upload to backend failed. Using local client fallback.', e?.message || e);
    }

    // Client fallback if backend is offline
    await new Promise((r) => setTimeout(r, 1000));
    return {
      success: true,
      imageUrl: fileUri || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
      fileId: `img_${Date.now()}`,
      projectId: `proj_${Date.now()}`,
      dimensions: { width: 3840, height: 2160 },
    };
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
    try {
      const imageId = params?.imageId || 'img_mock_1';
      const projectId = params?.projectId || 'proj_mock_1';

      // 1. Submit AI Processing Job to local backend
      const submitRes = await axios.post(`${BACKEND_BASE_URL}/ai/process`, {
        imageId,
        projectId,
        tool: toolId,
        params,
      }, {
        headers: { Authorization: 'Bearer mock_token' }
      });

      if (submitRes.data?.success) {
        const jobId = submitRes.data.data.id;

        // 2. Poll job status until complete (max 15 attempts)
        for (let i = 0; i < 15; i++) {
          await new Promise((r) => setTimeout(r, 400));
          const statusRes = await axios.get(`${BACKEND_BASE_URL}/ai/jobs/${jobId}`, {
            headers: { Authorization: 'Bearer mock_token' }
          });

          if (statusRes.data?.success) {
            const job = statusRes.data.data;
            if (job.status === 'COMPLETED') {
              return {
                success: true,
                processedImageUrl: job.outputImageUrl,
                toolUsed: toolId,
                processingTimeMs: job.processingTimeMs || 1000,
              };
            } else if (job.status === 'FAILED') {
              throw new Error(job.errorMessage || 'AI process failed');
            }
          }
        }
      }
    } catch (e: any) {
      console.warn('[Frontend API] Live backend call failed or timed out. Falling back to local filter simulation.', e?.message || e);
    }

    // Local filter simulation fallback
    await new Promise((r) => setTimeout(r, 1200));
    return {
      success: true,
      processedImageUrl: imageUri,
      toolUsed: toolId,
      processingTimeMs: 1200,
    };
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
    await new Promise((r) => setTimeout(r, 500));
    return MOCK_PROJECTS;
  },

  deleteProject: async (id: string) => {
    await new Promise((r) => setTimeout(r, 300));
    return { success: true, id };
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
    await new Promise((r) => setTimeout(r, 600));
    return { ...MOCK_USER, ...updates };
  },
};
