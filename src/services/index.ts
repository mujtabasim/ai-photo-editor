import axios from 'axios';
import { supabase } from '../lib/supabase';
import { ProjectHistory, UserProfile } from '../types';

const BACKEND_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

// Shared Axios Instance
const api = axios.create({
  baseURL: BACKEND_BASE_URL,
});

// Axios Interceptor - Dynamically attach Supabase Bearer Access Token
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    } catch (e) {
      console.warn('[Axios Interceptor] Error attaching Supabase token:', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const uploadApi = {
  uploadImage: async (fileUri: string) => {
    console.log(`[uploadApi.uploadImage] Uploading photo: ${fileUri}`);
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'user_upload.jpg');

      const res = await api.post('/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        }
      });

      if (res.data?.success) {
        const image = res.data.data.image;
        const project = res.data.data.project;
        console.log(`[uploadApi.uploadImage] Upload success. FileId: ${image.id}, ProjectId: ${project.id}`);
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
      console.error('[uploadApi.uploadImage] Error during upload:', e?.response?.data || e?.message || e);
      throw e;
    }
  },
};

export const editorApi = {
  processAITool: async (toolId: string, imageUri: string, params?: Record<string, any>) => {
    const imageId = params?.imageId || `img_${Date.now()}`;
    const projectId = params?.projectId || `proj_${Date.now()}`;

    console.log(`[AI Process] tool: ${toolId}, imageId: ${imageId}, projectId: ${projectId}`);
    try {
      const submitRes = await api.post('/ai/process', {
        imageId,
        projectId,
        tool: toolId,
        params,
      });

      if (submitRes.data?.success) {
        const jobId = submitRes.data.data.id;
        console.log(`[editorApi.processAITool] Job submitted. JobId: ${jobId}. Polling status...`);

        for (let i = 0; i < 20; i++) {
          await new Promise((r) => setTimeout(r, 600));
          const statusRes = await api.get(`/ai/jobs/${jobId}`);

          if (statusRes.data?.success) {
            const job = statusRes.data.data;
            console.log(`[editorApi.processAITool] Attempt ${i + 1}. Job Status: ${job.status}`);
            
            if (job.status === 'COMPLETED') {
              const returnedOutputImageUrl = job.outputImageUrl;
              const cacheBusterUrl = returnedOutputImageUrl?.includes('?')
                ? `${returnedOutputImageUrl}&v=${Date.now()}`
                : `${returnedOutputImageUrl}?v=${Date.now()}`;

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
      throw e;
    }
  },
};

export const historyApi = {
  getHistory: async (): Promise<ProjectHistory[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        console.log('[Project] No authenticated user ID found. Returning empty list.');
        return [];
      }

      console.log(`[Project] Fetching projects for user_id: ${user.id}`);

      // Query Supabase directly (enforces RLS user_id = auth.uid())
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.warn(`[Project Notice] Supabase project query notice: ${error.message}. Trying backend API...`);
      }

      if (data && data.length > 0) {
        console.log(`[Project] Fetched ${data.length} projects from Supabase for user_id: ${user.id}`);
        return data.map((p: any) => {
          const origUrl = p.original_url || p.originalUrl || p.storage_url || p.storageUrl || '';
          const procUrl = p.processed_url || p.processedUrl || origUrl || p.thumbnail_url || p.thumbnailUrl || '';
          const thumbUrl = p.thumbnail_url || p.thumbnailUrl || procUrl || origUrl;

          return {
            id: p.id,
            title: p.title || 'Edited Photo',
            originalUrl: origUrl,
            original_url: origUrl,
            processedUrl: procUrl,
            processed_url: procUrl,
            thumbnailUrl: thumbUrl,
            thumbnail_url: thumbUrl,
            toolUsed: p.tool_used || p.toolUsed || 'Original',
            createdAt: p.created_at || p.createdAt,
            isFavorite: p.is_favorite || p.isFavorite || false,
            originalImageId: p.original_image_id || p.originalImageId,
            fileSize: p.file_size || p.fileSize || '3.4 MB',
            dimensions: typeof p.dimensions === 'string' ? JSON.parse(p.dimensions) : (p.dimensions || { width: 1920, height: 1080 }),
          };
        }) as ProjectHistory[];
      }

      // Fallback query to backend API (which also authenticates with Bearer JWT user_id)
      const res = await api.get('/projects');
      if (res.data?.success && Array.isArray(res.data.data)) {
        console.log(`[Project] Fetched ${res.data.data.length} projects from backend API for user_id: ${user.id}`);
        return res.data.data as ProjectHistory[];
      }

      console.log(`[Project] Fetched 0 projects for user_id: ${user.id}`);
      return [];
    } catch (e: any) {
      console.error('[Project Error] Error fetching project history:', e?.message || e);
      return [];
    }
  },

  deleteProject: async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        console.log(`[Project] Deleting project: ${id} for user_id: ${user.id}`);
        await supabase
          .from('projects')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
      }
      const res = await api.delete(`/projects/${id}`);
      return { success: res.data?.success, id };
    } catch (e) {
      return { success: false, id };
    }
  },

  toggleFavorite: async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        const { data: current } = await supabase
          .from('projects')
          .select('is_favorite')
          .eq('id', id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (current) {
          await supabase
            .from('projects')
            .update({ is_favorite: !current.is_favorite, updated_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', user.id);
        }
      }
      const res = await api.post(`/projects/${id}/favorite`);
      return { success: res.data?.success, project: res.data?.data };
    } catch (e) {
      return { success: false, id };
    }
  },

  saveProject: async (project: ProjectHistory) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        console.warn('[Project Error] Cannot save project: No authenticated user.');
        return { success: false, project };
      }

      console.log(`[Project] Saving project: ${project.id} for user_id: ${user.id}`);

      const projectPayload = {
        id: project.id,
        user_id: user.id,
        title: project.title || 'Edited Photo',
        original_url: project.originalUrl,
        processed_url: project.processedUrl || project.originalUrl,
        thumbnail_url: project.thumbnailUrl || project.processedUrl || project.originalUrl,
        tool_used: project.toolUsed || 'Original',
        is_favorite: project.isFavorite || false,
        original_image_id: project.originalImageId || null,
        file_size: project.fileSize || '3.4 MB',
        dimensions: project.dimensions ? JSON.stringify(project.dimensions) : null,
        updated_at: new Date().toISOString(),
        created_at: project.createdAt || new Date().toISOString(),
      };

      // 1. Upsert into Supabase 'projects' table (enforcing user_id RLS)
      const { error: projError } = await supabase
        .from('projects')
        .upsert(projectPayload);

      if (projError) {
        console.error(`[Project Error] Failed to save project ${project.id} to Supabase:`, projError.message);
      } else {
        console.log(`[Project] Project saved successfully to Supabase for user_id: ${user.id}`);
      }

      // 2. Insert/Upsert image record into 'images' table
      const imgId = project.originalImageId || project.id;
      const { error: imgError } = await supabase
        .from('images')
        .upsert({
          id: imgId,
          user_id: user.id,
          storage_url: project.originalUrl,
          filename: 'user_upload.jpg',
          created_at: new Date().toISOString(),
        });

      if (!imgError) {
        console.log(`[Image] Saved image record for image_id: ${imgId}, user_id: ${user.id}`);
      }

      // 3. Insert edit entry into 'edit_history' table
      if (project.toolUsed && project.toolUsed !== 'Original') {
        const { error: editError } = await supabase
          .from('edit_history')
          .insert({
            id: `edit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            user_id: user.id,
            project_id: project.id,
            tool_used: project.toolUsed,
            output_url: project.processedUrl || project.originalUrl,
            created_at: new Date().toISOString(),
          });

        if (!editError) {
          console.log(`[EditHistory] Saved edit entry for project: ${project.id}, user_id: ${user.id}`);
        }
      }

      // Also notify backend API
      const res = await api.post('/projects/save', project);
      return { success: true, project: res.data?.data || project };
    } catch (e: any) {
      console.error(`[Project Error] Failed saving project ${project.id}:`, e?.message || e);
      return { success: false, project };
    }
  },
};
