import { randomUUID } from 'node:crypto'
export type DeveloperAction = 'read_repository' | 'modify_repository' | 'create_project' | 'publish_site' | 'create_3d_project'
export type Authorization = { actorId: string; action: DeveloperAction; approved: boolean; reason?: string }
export type DeveloperToolGateway = { authorize(request: Authorization): Promise<{ id: string; allowed: false; reason: string }> }
export class DisabledDeveloperToolGateway implements DeveloperToolGateway {
  async authorize(request: Authorization) { return { id: randomUUID(), allowed: false as const, reason: `Ação ${request.action} requer autorização humana explícita e ainda não está habilitada.` } }
}
