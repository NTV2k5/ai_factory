import { ENV } from '../config/env';

export interface ChatParticipant {
  id: string;
}

export interface Chat {
  id: string;
  status: string;
  participants: ChatParticipant[];
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

class AgynChatService {
  private baseUrl = ENV.AGYN_GATEWAY_URL;
  private token = ENV.AGYN_TOKEN;

  private async postChatRPC<T>(service: string, method: string, body: Record<string, unknown>): Promise<T> {
    const primaryUrl = `${this.baseUrl}/api/agynio.api.${service}.v1.${service === 'chat' ? 'ChatService' : 'NotificationsService'}/${method}`;
    const fallbackUrl = `${this.baseUrl}/agynio.api.${service}.v1.${service === 'chat' ? 'ChatService' : 'NotificationsService'}/${method}`;

    try {
      let resp = await fetch(primaryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        resp = await fetch(fallbackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(body),
        });
      }

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return resp.json() as Promise<T>;
    } catch (e: any) {
      console.warn(`Agyn ChatService [${service}/${method}] call notice:`, e?.message);
      throw e;
    }
  }

  // 1. CreateChat (Bước 1: Tạo cuộc hội thoại mới khi user mở chat)
  async createChat(agentId: string): Promise<{ chat: Chat }> {
    return this.postChatRPC('chat', 'CreateChat', {
      participantIds: [agentId],
      participant_ids: [agentId],
      organizationId: ENV.AGYN_ORGANIZATION_ID,
      organization_id: ENV.AGYN_ORGANIZATION_ID,
    });
  }

  // 2. SendMessage (Bước 2: Gửi tin nhắn user)
  async sendMessage(chatId: string, bodyText: string): Promise<{ message: ChatMessage }> {
    return this.postChatRPC('chat', 'SendMessage', {
      chatId,
      chat_id: chatId,
      body: bodyText,
    });
  }

  // 3. GetMessages (Bước 3: Poll lấy danh sách tin nhắn mới)
  async getMessages(chatId: string, pageSize: number = 20): Promise<{ messages: ChatMessage[] }> {
    return this.postChatRPC('chat', 'GetMessages', {
      chatId,
      chat_id: chatId,
      pageSize,
      page_size: pageSize,
    });
  }

  // 4. Subscribe (Real-time Streaming Notifications)
  async subscribe(chatId: string, onMessageReceived: (payload: any) => void): Promise<() => void> {
    try {
      const resp = await fetch(`${this.baseUrl}/api/agynio.api.notifications.v1.NotificationsService/Subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          rooms: [`chat:${chatId}`],
        }),
      });

      if (resp.ok && resp.body) {
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let isReading = true;

        (async () => {
          while (isReading) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) {
              const text = decoder.decode(value);
              try {
                const parsed = JSON.parse(text);
                if (parsed?.envelope?.payload) {
                  onMessageReceived(parsed.envelope.payload);
                }
              } catch (e) {
                // Ignore parse errors for streaming chunks
              }
            }
          }
        })();

        return () => {
          isReading = false;
          reader.cancel();
        };
      }
    } catch (e: any) {
      console.warn("Subscribe streaming notice:", e?.message);
    }
    return () => {};
  }
}

export const agynChatService = new AgynChatService();
export default agynChatService;
