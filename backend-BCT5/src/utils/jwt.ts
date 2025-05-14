export interface JWTPayload {
  sub: string;
  role: string;
}

export function isJWTPayload(payload: unknown): payload is JWTPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'sub' in payload &&
    'role' in payload
  );
}