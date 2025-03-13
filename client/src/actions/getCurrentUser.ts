"use server";

import { getBackendURL } from "@/lib/getBackendURL";
import { User } from "@/lib/type";
import { headers } from "next/headers";
import { cache } from "react";

export const getCurrentUser = cache(
  async (): Promise<{ user: null } | { user: User }> => {
    try {
      const res = await fetch(
        `${getBackendURL()}/auth/check-user`,
        {
          headers: headers(),
        }
      );
  
      const data = await res.json();
  
      if (data.status === "success") {
        return {
          user: data.user,
        };
      } else {
        return {
          user: null,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        user: null
      }
    }
    
  }
);
