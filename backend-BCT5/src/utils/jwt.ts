export interface JWTPayload {
  id: string;
  name: string;
  student_id?: string; // ✅ เพิ่ม
  exp?: number;
  iat?: number;
  sub?: string;
  role?: string;
}

export const isJWTPayload = (payload: any): payload is JWTPayload => {
  return (
    typeof payload === 'object' &&
    'id' in payload &&
    'role' in payload &&
    'student_id' in payload // ✅ สอดคล้องกับ interface
  );
};