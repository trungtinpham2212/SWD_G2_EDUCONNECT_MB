import { logoutFCMCleanup } from "@/api";
import { useAuth } from "@/features/auth/context/AuthContext";


export const handleUnauthorized = async () => {
    const { logout, authState } = useAuth();

    const userId = authState?.user?.userId;
  
    if (userId) {
      await logoutFCMCleanup(userId);
    }
  
    await logout();
  };