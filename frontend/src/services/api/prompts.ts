import api from "./config";

export interface Prompt {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
}

export const promptsApi = {
  getAllPrompts: async (): Promise<Prompt[]> => {
    const response = await api.get<Prompt[]>("/prompts");
    return response.data;
  },

  getPrompt: async (promptId: number): Promise<Prompt> => {
    const response = await api.get<Prompt>(`/prompts/${promptId}`);
    return response.data;
  },

  createPrompt: async (name: string): Promise<Prompt> => {
    const response = await api.post<Prompt>("/prompts", { name });
    return response.data;
  },

  renamePrompt: async (id: number, newName: string): Promise<Prompt> => {
    const response = await api.patch(`/prompts/${id}/rename`, {
      new_name: newName,
    });
    return response.data;
  },

  deletePrompt: async (promptId: number): Promise<void> => {
    await api.delete(`/prompts/${promptId}`);
  },
};
