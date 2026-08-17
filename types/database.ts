// Tipos do banco Supabase.
// Mantidos em um único objeto "Row" para simplicidade — usamos `any` em inserts
// no client, e a validação é feita via Zod nos server actions.

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
        Insert: any;
        Update: any;
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
        Insert: any;
        Update: any;
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
        Insert: any;
        Update: any;
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
        Insert: any;
        Update: any;
      };
      combo_services: {
        Row: { combo_id: string; service_id: string };
        Insert: any;
        Update: any;
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
        Insert: any;
        Update: any;
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
        Insert: any;
        Update: any;
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
        Insert: any;
        Update: any;
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
        Insert: any;
        Update: any;
      };
    };
    Functions: {
      is_admin: { Args: { uid: string }; Returns: boolean };
    };
  };
};
