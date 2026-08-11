import { ENV } from '../config/env';

export interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

class AgynThreadService {
  private baseUrl = ENV.AGYN_GATEWAY_URL;
  private token = ENV.AGYN_TOKEN;

  private async postRPC<T>(method: string, body: Record<string, unknown>): Promise<T> {
    const url = `${this.baseUrl}/agynio.api.gateway.v1.ThreadsGateway/${method}`;
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return resp.json() as Promise<T>;
    } catch (e: any) {
      console.warn(`Agyn ThreadsGateway call [${method}] failed:`, e?.message);
      throw e;
    }
  }

  async postUserMessageToThread(message: string, agentName?: string): Promise<void> {
    await this.postRPC('CreateMessage', {
      content: message,
      agent_context: agentName || '',
      organization_id: ENV.AGYN_ORGANIZATION_ID,
    });
  }
}

export const agynThreadService = new AgynThreadService();
export default agynThreadService;
