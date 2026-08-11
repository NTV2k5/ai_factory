import { ENV } from '../config/env';

// ─── ConnectRPC Types ─────────────────────────────────────────────────
export interface AgentMeta { id: string; createdAt: string; updatedAt: string; }
export interface Agent {
  meta: AgentMeta;
  name: string;
  role: string;
  model: string;
  description: string;
  configuration: string;
  resources: Record<string, unknown>;
  initImage: string;
  organizationId: string;
  idleTimeout: string;
  availability: string;
}
export interface Skill {
  meta: AgentMeta;
  agentId: string;
  name: string;
  body: string;
  description: string;
}
export interface CreateSkillDTO { agent_id: string; name: string; description: string; body: string; }
export interface UpdateSkillDTO { id: string; name: string; description: string; body: string; }

// ─── AgynApiService ────────────────────────────────────────────────────
class AgynApiService {
  private baseUrl = ENV.AGYN_GATEWAY_URL;
  private token = ENV.AGYN_TOKEN;

  private async postRPC<T>(method: string, body: Record<string, unknown>): Promise<T> {
    const url = `${this.baseUrl}/agynio.api.gateway.v1.AgentsGateway/${method}`;
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
      console.warn(`Agyn ConnectRPC call to [agynio.api.gateway.v1.AgentsGateway/${method}] failed:`, e?.message);
      throw e;
    }
  }

  // ─── Agents ─────────────────────────────────────────────────────────
  async listAgents(): Promise<{ agents: Agent[] }> {
    return this.postRPC('ListAgents', {});
  }

  async createAgent(dto: { name: string; role: string; description: string; model?: string }): Promise<{ agent: Agent }> {
    return this.postRPC('CreateAgent', {
      name: dto.name,
      role: dto.role,
      description: dto.description,
      model: dto.model || '',
      organization_id: ENV.AGYN_ORGANIZATION_ID,
    });
  }

  async deleteAgent(id: string): Promise<void> {
    return this.postRPC('DeleteAgent', { id });
  }

  // ─── Skills ─────────────────────────────────────────────────────────
  async listSkills(agentId: string): Promise<{ skills: Skill[] }> {
    return this.postRPC('ListSkills', { agent_id: agentId });
  }

  async createSkill(dto: CreateSkillDTO): Promise<{ skill: Skill }> {
    return this.postRPC('CreateSkill', {
      agent_id: dto.agent_id,
      name: dto.name,
      description: dto.description,
      body: dto.body,
    });
  }

  async updateSkill(dto: UpdateSkillDTO): Promise<{ skill: Skill }> {
    return this.postRPC('UpdateSkill', {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      body: dto.body,
    });
  }

  async deleteSkill(id: string): Promise<void> {
    return this.postRPC('DeleteSkill', { id });
  }
}

export const agynApiService = new AgynApiService();
export default agynApiService;
