import { api } from "./client";

export interface PollOption {
    id: string
    text: number
    votes: number
}

export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    expiresAt: string;
    isPublished: boolean;
    creatorId: string;
    createdAt: string
}
