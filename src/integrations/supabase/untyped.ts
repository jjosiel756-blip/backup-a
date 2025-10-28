import { supabase } from "@/integrations/supabase/client";

// Untyped supabase client to bypass strict Database typings when types are out of sync
export const sb = supabase as any;
