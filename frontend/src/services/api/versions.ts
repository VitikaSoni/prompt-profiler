import api from "./config";

export interface Version {
  id: number;
  number: number;
  system_prompt: string;
  prompt_id: number;
  created_at: string;
}

export interface CreateVersionData {
  prompt_id: number;
  content: string;
}

export const versionsApi = {
  getAllVersions: async (promptId: number): Promise<Version[]> => {
    const response = await api.get<Version[]>(
      `/versions?prompt_id=${promptId}`
    );
    return response.data;
  },
  getCurrentVersion: async (promptId: number): Promise<Version> => {
    const response = await api.get<Version>(`/versions/current/${promptId}`);
    return response.data;
  },

  getVersion: async (versionId: number): Promise<Version> => {
    const response = await api.get<Version>(`/versions/${versionId}`);
    return response.data;
  },

  createVersion: async (
    promptId: number,
    systemPrompt: string
  ): Promise<Version> => {
    const response = await api.post<Version>("/versions", {
      prompt_id: promptId,
      system_prompt: systemPrompt,
    });
    return response.data;
  },

  updateVersion: async (
    versionId: number,
    data: Partial<CreateVersionData>
  ): Promise<Version> => {
    const response = await api.put<Version>(`/versions/${versionId}`, data);
    return response.data;
  },

  deleteVersion: async (versionId: number): Promise<void> => {
    await api.delete(`/versions/${versionId}`);
  },

  getLatestVersion: async (promptId: number): Promise<Version> => {
    const response = await api.get<Version>(`/versions/latest/${promptId}`);
    return response.data;
  },

  getVersionsByPromptId: async (promptId: number): Promise<Version[]> => {
    const response = await api.get<Version[]>(`/versions/prompt/${promptId}`);
    return response.data;
  },
};
