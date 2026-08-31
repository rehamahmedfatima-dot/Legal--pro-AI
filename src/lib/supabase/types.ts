/**
 * Hand-authored subset of the generated Supabase types, matching
 * supabase/migrations/0001_init.sql. Regenerate with:
 *   supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 * once the project is linked, and this file becomes obsolete.
 */
export type UserRole = "admin" | "lawyer" | "client";
export type CaseStatus = "open" | "in_progress" | "pending_court" | "closed" | "appealed";
export type CasePriority = "low" | "medium" | "high" | "urgent";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          role: UserRole;
          avatar_url: string | null;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          locale?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      cases: {
        Row: {
          id: string;
          case_number: string;
          title: string;
          category: string;
          status: CaseStatus;
          priority: CasePriority;
          court_name: string | null;
          judge_name: string | null;
          lawyer_id: string;
          client_id: string;
          opened_at: string;
          closed_at: string | null;
          outcome: string | null;
          summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          case_number: string;
          title: string;
          category: string;
          status?: CaseStatus;
          priority?: CasePriority;
          court_name?: string | null;
          judge_name?: string | null;
          lawyer_id: string;
          client_id: string;
          summary?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["cases"]["Insert"]>;
      };
      case_timeline_events: {
        Row: {
          id: string;
          case_id: string;
          event_type: string;
          title: string;
          description: string | null;
          event_date: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          case_id: string;
          event_type: string;
          title: string;
          description?: string | null;
          event_date: string;
          created_by: string;
        };
        Update: Partial<Database["public"]["Tables"]["case_timeline_events"]["Insert"]>;
      };
      contract_analyses: {
        Row: {
          id: string;
          uploaded_by: string;
          case_id: string | null;
          file_path: string;
          file_name: string;
          status: "pending" | "completed" | "failed";
          summary: string | null;
          risks: { clause: string; issue: string; severity: string }[];
          obligations: { party: string; obligation: string }[];
          rights: { party: string; right: string }[];
          missing_clauses: string[];
          recommendations: string[];
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          uploaded_by: string;
          case_id?: string | null;
          file_path: string;
          file_name: string;
          status?: "pending" | "completed" | "failed";
        };
        Update: Partial<Database["public"]["Tables"]["contract_analyses"]["Insert"]>;
      };
      generated_documents: {
        Row: {
          id: string;
          created_by: string;
          case_id: string | null;
          document_type: string;
          title: string;
          content: string;
          form_data: Record<string, string>;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          created_by: string;
          case_id?: string | null;
          document_type: string;
          title: string;
          content: string;
          form_data?: Record<string, string>;
          language?: string;
        };
        Update: Partial<Database["public"]["Tables"]["generated_documents"]["Insert"]>;
      };
    };
  };
}
