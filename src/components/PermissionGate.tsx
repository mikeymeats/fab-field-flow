import { ReactNode } from 'react';
import { useDB } from '@/store/db';
import { hasPermission } from '@/lib/personas';

interface PermissionGateProps {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
}

export function PermissionGate({ children, permission, fallback = null }: PermissionGateProps) {
  const { currentUser } = useDB();
  
  if (!currentUser) {
    return <>{fallback}</>;
  }
  
  const userHasPermission = hasPermission(currentUser.permissions, permission);
  
  return userHasPermission ? <>{children}</> : <>{fallback}</>;
}

interface PersonaGateProps {
  children: ReactNode;
  allowedPersonas: string[];
  fallback?: ReactNode;
}

export function PersonaGate({ children, allowedPersonas, fallback = null }: PersonaGateProps) {
  const { currentUser } = useDB();
  
  if (!currentUser || !allowedPersonas.includes(currentUser.persona)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}