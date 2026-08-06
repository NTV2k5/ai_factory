export interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export const threadService = {
  async getThreadMessages(threadId: string): Promise<Message[]> {
    return [
      { id: 'm1', sender: 'user', text: 'Analyze PRD requirements', timestamp: '10:00 AM' },
      { id: 'm2', sender: 'agent', text: 'Requirements extracted successfully.', timestamp: '10:01 AM' },
    ];
  },
};
