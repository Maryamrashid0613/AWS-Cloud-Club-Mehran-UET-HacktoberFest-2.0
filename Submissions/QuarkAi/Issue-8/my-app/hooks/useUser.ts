"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        
        console.log('🔍 Auth User:', user);
        setUser(user);

        if (user) {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          
          console.log('🔍 Profile Query Result:', profile);
          console.log('🔍 Profile Query Error:', error);
          
          if (error) {
            console.error('❌ Error fetching profile:', error);
            // Profile doesn't exist, try to create it
            const { data: newProfile, error: insertError } = await supabase
              .from("profiles")
              .insert({
                id: user.id,
                email: user.email!,
                role: 'cashier',
              })
              .select()
              .single();
            
            if (insertError) {
              console.error('❌ Error creating profile:', insertError);
            } else {
              console.log('✅ Created new profile:', newProfile);
              setProfile(newProfile);
            }
          } else {
            setProfile(profile);
          }
        }
      } catch (error) {
        console.error('❌ Error in getUser:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)  // Fixed: was using email, should be id
          .single();
        
        console.log('🔍 Profile on Auth Change:', profile);
        
        if (error) {
          console.error('❌ Error fetching profile on auth change:', error);
        }

        setProfile(profile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading, isAdmin: profile?.role === "admin" };
}
