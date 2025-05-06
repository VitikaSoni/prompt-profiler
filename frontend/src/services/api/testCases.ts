import api from "./config";

export interface TestCase {
  id: number;
  prompt_id: number;
  user_message: string;
}

export interface CreateTestCaseData {
  prompt_id: number;
  input: string;
  expected_output: string;
}

export const testCasesApi = {
  getAllTestCases: async (promptId: number): Promise<TestCase[]> => {
    const response = await api.get<TestCase[]>(
      `/test-cases/prompt/${promptId}`
    );
    return response.data;
  },

  getTestCase: async (testCaseId: number): Promise<TestCase> => {
    const response = await api.get<TestCase>(`/test-cases/${testCaseId}`);
    return response.data;
  },

  createTestCase: async (
    promptId: number,
    testCase: { user_message: string }
  ): Promise<TestCase> => {
    const response = await api.post<TestCase>(
      `/test-cases?prompt_id=${promptId}`,
      testCase
    );
    return response.data;
  },

  deleteTestCase: async (testCaseId: number): Promise<void> => {
    await api.delete(`/test-cases/${testCaseId}`);
  },
};
