export interface JWTPayload {
  id: string;
  name: string;
  exp?: number;
  iat?: number;
  sub?: string;  // เพิ่ม sub
  role?: string; // เพิ่ม role
}
export const isJWTPayload = (payload: any): payload is JWTPayload => {
  return (
    typeof payload === 'object' &&
    'id' in payload &&
    'role' in payload &&
    'student_id' in payload
  );
};