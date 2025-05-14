export interface JWTPayload {
  id: string;
  role: string;
  iat?: number; // วันที่ออกโทเค็น (optional)
  exp?: number; // วันที่หมดอายุ (optional)
}

export function isJWTPayload(payload: any): payload is JWTPayload {
  return (
    payload &&
    typeof payload.id === 'string' &&
    typeof payload.role === 'string'
  );
}