// Tipos gerados manualmente a partir das migrations.
// Em produção, você pode regenerar com:
//   npx supabase gen types typescript --project-id <id> > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      settings: {
        Row: {
          id: number;
          company_name: string;
          whatsapp_number: string | null;
          hero_title: string | null;
          hero_subtitle: string | null;
          hero_cta_label: string | null;
          about_text: string | null;
          contact_email: string | null;
          instagram_url: string | null;
          facebook_url: string | null;
          youtube_url: string | null;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["settings"]["Row"],
          "updated_at"
        > & { updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
      };
      services: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          display_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["services"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
      };
      combos: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price_cents: number;
          original_price_cents: number | null;
          whatsapp_message: string;
          display_order: number;
          active: boolean;
          featured: boolean;
          badge_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["combos"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["combos"]["Insert"]>;
      };
      combo_services: {
        Row: { combo_id: string; service_id: string };
        Insert: { combo_id: string; service_id: string };
        Update: Partial<Database["public"]["Tables"]["combo_services"]["Insert"]>;
      };
      portfolio_items: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          client_name: string | null;
          year: number | null;
          category: string | null;
          display_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["portfolio_items"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["portfolio_items"]["Insert"]>;
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          role: string | null;
          content: string;
          avatar_url: string | null;
          rating: number | null;
          display_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["testimonials"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          display_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["faqs"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Insert"]>;
      };
      how_it_works_steps: {
        Row: {
          id: string;
          step_number: number;
          title: string;
          description: string;
          icon: string | null;
          display_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["how_it_works_steps"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<
          Database["public"]["Tables"]["how_it_works_steps"]["Insert"]
        >;
      };
    };
    Functions: {
      is_admin: { Args: { uid: string }; Returns: boolean };
    };
  };
};
