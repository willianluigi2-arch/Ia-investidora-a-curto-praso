export type AuditEvent = { action: string; resource: string; mode: 'simulation-only'; createdAt: string }

export interface AuditStore {
  append(event: AuditEvent): void
  list(): AuditEvent[]
}

export class InMemoryAuditStore implements AuditStore {
  private readonly events: AuditEvent[] = []

  append(event: AuditEvent): void { this.events.push(event) }
  list(): AuditEvent[] { return [...this.events] }
}