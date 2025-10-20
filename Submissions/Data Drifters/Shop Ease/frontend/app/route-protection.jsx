"use client"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/") // unauthorized
    }
  }, [user, allowedRoles, router])

  if (!user) return null // or a loader
  if (allowedRoles && !allowedRoles.includes(user.role)) return null

  return <>{children}</>
}


// "use client";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function ProtectedRoute({ allowedRoles, children }) {
//   const { user } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!user) router.push("/login");
//     else if (!allowedRoles.includes(user.role)) router.push("/");
//   }, [user]);

//   return user && allowedRoles.includes(user.role) ? children : null;
// }
