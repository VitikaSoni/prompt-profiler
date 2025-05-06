import api from "./config";

export interface RunResult {
  test_case_id: number;
  user_message: string;
  output: string;
}

export interface RunResponse {
  results: RunResult[];
}

export const runApi = {
  runPrompt: async (
    promptId: number,
    systemPrompt: string
  ): Promise<RunResponse> => {
    const response = await api.post<RunResponse>(`/run/prompt/${promptId}`, {
      system_prompt: systemPrompt,
    });
    return response.data;
  },
};
