import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// Set up axios defaults
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "token"
)}`;

export interface Prompt {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
}

export const promptService = {
  getAll: async (): Promise<Prompt[]> => {
    const response = await axios.get(`${API_BASE_URL}/prompts/`);
    return response.data;
  },

  create: async (name: string): Promise<Prompt> => {
    const response = await axios.post(`${API_BASE_URL}/prompts/`, { name });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/prompts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  rename: async (id: number, newName: string): Promise<Prompt> => {
    const response = await axios.patch(`${API_BASE_URL}/prompts/${id}/rename`, {
      new_name: newName,
    });
    return response.data;
  },
};

// Test Cases API
export const createTestCase = async (
  promptId: number,
  testCase: { user_message: string }
) => {
  const response = await axios.post(
    `${API_BASE_URL}/test-cases/?prompt_id=${promptId}`,
    testCase
  );
  return response.data;
};

export const getTestCases = async (promptId: number) => {
  const response = await axios.get(
    `${API_BASE_URL}/test-cases/prompt/${promptId}`
  );
  return response.data;
};

export const updateTestCase = async (
  testCaseId: number,
  testCase: { user_message?: string }
) => {
  const response = await axios.put(
    `${API_BASE_URL}/test-cases/${testCaseId}`,
    testCase
  );
  return response.data;
};

export const deleteTestCase = async (testCaseId: number) => {
  const response = await axios.delete(
    `${API_BASE_URL}/test-cases/${testCaseId}`
  );
  return response.data;
};

// Prompt API
export const deletePrompt = async (promptId: number) => {
  const response = await axios.delete(`${API_BASE_URL}/prompts/${promptId}`);
  return response.data;
};

export const renamePrompt = async (promptId: number, newName: string) => {
  const response = await axios.patch(
    `${API_BASE_URL}/prompts/${promptId}/rename`,
    {
      new_name: newName,
    }
  );
  return response.data;
};

// Version API
export interface Version {
  id: number;
  number: number;
  system_prompt: string;
  prompt_id: number;
  created_at: string;
}

export const versionService = {
  create: async (promptId: number, systemPrompt: string): Promise<Version> => {
    const response = await axios.post(`${API_BASE_URL}/versions/`, {
      prompt_id: promptId,
      system_prompt: systemPrompt,
    });
    return response.data;
  },

  getByPromptId: async (promptId: number): Promise<Version[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/versions/prompt/${promptId}`
    );
    return response.data;
  },

  getCurrentVersion: async (promptId: number): Promise<Version | null> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/versions/prompt/${promptId}/current`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

// Run API
export interface RunTestCase {
  test_case_id: number;
  user_message: string;
  output: string;
}

export interface RunResponse {
  results: RunTestCase[];
}

export const runPrompt = async (
  promptId: number,
  systemPrompt: string
): Promise<RunResponse> => {
  const response = await axios.post(`${API_BASE_URL}/run/prompt/${promptId}`, {
    system_prompt: systemPrompt,
  });
  return response.data;
};
