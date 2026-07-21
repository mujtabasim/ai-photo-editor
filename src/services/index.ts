import { MOCK_USER, MOCK_PROJECTS, MOCK_SUBSCRIPTION_PLANS } from '../constants/mockData';
import { ProjectHistory, UserProfile } from '../types';

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
    await new Promise((r) => setTimeout(r, 1200));
    return {
      success: true,
      imageUrl: fileUri || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
      fileId: `file_${Date.now()}`,
      dimensions: { width: 3840, height: 2160 },
    };
  },

  uploadMultiple: async (uris: string[]) => {
    await new Promise((r) => setTimeout(r, 1800));
    return {
      success: true,
      uploadedCount: uris.length,
      images: uris.map((uri, i) => ({ id: `batch_${i}`, url: uri })),
    };
  },
};

export const editorApi = {
  processAITool: async (toolId: string, imageUri: string, params?: Record<string, any>) => {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      success: true,
      processedImageUrl: imageUri,
      toolUsed: toolId,
      processingTimeMs: 1420,
    };
  },

  saveExport: async (project: Partial<ProjectHistory>) => {
    await new Promise((r) => setTimeout(r, 700));
    return {
      success: true,
      projectId: `proj_${Date.now()}`,
      savedUrl: project.processedUrl || project.originalUrl,
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
