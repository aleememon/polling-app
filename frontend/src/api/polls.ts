import { api } from "./client";

// Question Interface
export interface Question {
  id: string;
  pollId: string;
  text: string;
  isMandatory: string;
  options: string[];
}

// Poll Interface
export interface Poll {
  id: string;
  creatorId: string;
  title: string;
  slug: string;
  isAnonymous: boolean;
  isPublished: boolean;
  expiresAt: string;
  createdAt: string;
  question?: Question[];
}

export interface CreatePollPayload {
  title: string;
  isAnonymous?: boolean;
  expiresAt: string;
  questions: {
    text: string;
    isMandatory?: boolean;
    options: string[];
  }[];
}

export interface SubmitVotePayload {
  answers: {
    questionId: string;
    chosenOption: string | string[];
  }[];
}

export interface PollAnalytics {
  success: boolean;
  analytics: {
    totalResponses: number;
    participationInsights: {
      anonymousCount: number;
      authenticatedCount: number;
    };
    questionsSummary: {
      questionId: string;
      questionText: string;
      totalVotesForQuestion: number;
      results: {
        option: string;
        count: number;
      }[];
    }[];
  };
}

export interface PublicPollsFilters {
  search?: string;
  status?: "active" | "expired";
  isAnonymous?: "true" | "false";
}

export interface ServerResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const pollsApi = {
  // private route
  createPoll: async (
    payload: CreatePollPayload,
  ): Promise<ServerResponse<Poll>> => {
    try {
      const response = await api.post("/api/polls/create", payload);

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to establish new voting ballot.",
      );
    }
  },

  // private route
  getCreatorDashboardPolls: async (): Promise<ServerResponse<Poll[]>> => {
    try {
      const response = await api.get<ServerResponse<Poll[]>>(
        "/api/polls/dashboard",
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Failed to populate creator profile dashboard.",
      );
    }
  },

  // private route
  getPollAnalytics: async (pollId: string): Promise<PollAnalytics> => {
    try {
      const response = await api.get<PollAnalytics>(
        `/api/polls/${pollId}/analytics`,
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Unable to extract analytic calculations.",
      );
    }
  },

  // private route
  publishPoll: async (pollId: string): Promise<ServerResponse<Poll>> => {
    try {
      const response = await api.patch<ServerResponse<Poll>>(
        `/api/polls/${pollId}/publish`,
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to commit layout state to live.",
      );
    }
  },

  // private route
  deletePoll: async (pollId: string): Promise<ServerResponse<string>> => {
    try {
      const response = await api.delete<ServerResponse<string>>(
        `/api/polls/${pollId}/delete`,
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Purge requests denied.");
    }
  },

  // public poll
  getPublicPollById: async (pollId: string): Promise<ServerResponse<Poll>> => {
    try {
      const response = await api.get(`/api/polls/${pollId}`);

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Poll access point unreachable.",
      );
    }
  },

  // public poll submit poll route
  submitPollResponse: async (
    pollId: string,
    payload: SubmitVotePayload,
  ): Promise<ServerResponse<any>> => {
    try {
      const response = await api.post<ServerResponse<any>>(
        `/api/polls/${pollId}/responses`,
        payload,
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Vote processing fault.");
    }
  },

  getPublicPolls: async (
    filters?: PublicPollsFilters,
  ): Promise<{ success: boolean; count: number; polls: Poll[] }> => {
    try {
      const response = await api.get<{
        success: boolean;
        count: number;
        polls: Poll[];
      }>("/api/polls", {
        params: filters,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Could not synchronize stream options.",
      );
    }
  },
};
