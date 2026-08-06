import { ENV } from '../config/env';

export interface TaskPayload {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  agentType: string;
}

export const agynApi = {
  async getTasks() {
    return [
      { id: 'task-101', title: 'Design Agent Artifact Integration', status: 'completed', createdAt: '2026-08-04' },
      { id: 'task-102', title: 'Synthesize Historical Git Commits', status: 'in_progress', createdAt: '2026-08-10' },
    ];
  },
  async createTask(payload: TaskPayload) {
    return { id: `task-${Date.now()}`, ...payload, status: 'queued', createdAt: new Date().toISOString() };
  },
};
