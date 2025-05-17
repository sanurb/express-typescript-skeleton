export interface SerializableLog {
  readonly timestamp: string;
  readonly level: string;
  readonly message: string;
  readonly context?: string;
  readonly meta?: unknown;
}
