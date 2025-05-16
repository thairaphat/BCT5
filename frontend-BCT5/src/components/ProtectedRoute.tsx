// src/components/ProtectedRoute.tsx
import { useAppSelector } from "../store/hooks";
import { Navigate, useLocation } from "react-router-dom";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const user = useAppSelector((state) => state.auth.currentUser);
  const location = useLocation();

  if (!user) {
    // ถ้ายังไม่ login → เด้งกลับ /login พร้อมจำ path เดิมไว้
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
