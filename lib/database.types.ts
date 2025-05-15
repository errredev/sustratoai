// lib/database.types.ts

export interface Database {
  public: {
    Tables: {
      users_profiles: {
        // Anteriormente perfil_investigador
        Row: {
          user_id: string; // uuid, PK, FK a auth.users(id)
          first_name: string | null; // text, NULLABLE
          last_name: string | null; // text, NULLABLE
          public_display_name: string | null; // text, NULLABLE
          public_contact_email: string | null; // text, NULLABLE
          primary_institution: string | null; // text, NULLABLE
          contact_phone: string | null; // text, NULLABLE
          general_notes: string | null; // text, NULLABLE
          preferred_language: string | null; // text, NULLABLE, DEFAULT 'es'
          pronouns: string | null; // text, NULLABLE
          created_at: string; // timestamptz, DEFAULT now()
          updated_at: string; // timestamptz, DEFAULT now()
        };
        Insert: {
          user_id: string; // Requerido
          first_name?: string | null;
          last_name?: string | null;
          public_display_name?: string | null;
          public_contact_email?: string | null;
          primary_institution?: string | null;
          contact_phone?: string | null;
          general_notes?: string | null;
          preferred_language?: string | null;
          pronouns?: string | null;
          created_at?: string; // Opcional, default en DB
          updated_at?: string; // Opcional, default en DB
        };
        Update: {
          user_id?: string; // PK, usualmente no se actualiza
          first_name?: string | null;
          last_name?: string | null;
          public_display_name?: string | null;
          public_contact_email?: string | null;
          primary_institution?: string | null;
          contact_phone?: string | null;
          general_notes?: string | null;
          preferred_language?: string | null;
          pronouns?: string | null;
          // created_at no se actualiza
          updated_at?: string; // Se actualiza por trigger
        };
        Relationships: [
          {
            foreignKeyName: "users_profiles_user_id_fkey"; // Asume este nombre para la FK a auth.users
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      projects: {
        // Anteriormente proyectos
        Row: {
          id: string; // uuid, PK
          name: string; // text, NOT NULL
          code: string | null; // text, NULLABLE, UNIQUE
          description: string | null; // text, NULLABLE
          institution_name: string | null; // text, NULLABLE
          lead_researcher_user_id: string | null; // uuid, NULLABLE, FK a auth.users(id)
          status: string; // text, NOT NULL, DEFAULT 'draft'
          module_bibliography: boolean; // boolean, DEFAULT FALSE
          module_interviews: boolean; // boolean, DEFAULT FALSE
          module_planning: boolean; // boolean, DEFAULT FALSE
          created_at: string; // timestamptz, DEFAULT now()
          updated_at: string; // timestamptz, DEFAULT now()
        };
        Insert: {
          id?: string; // Default en DB
          name: string; // Requerido
          code?: string | null;
          description?: string | null;
          institution_name?: string | null;
          lead_researcher_user_id?: string | null;
          status?: string; // Default en DB
          module_bibliography?: boolean; // Default en DB
          module_interviews?: boolean; // Default en DB
          module_planning?: boolean; // Default en DB
          created_at?: string; // Default en DB
          updated_at?: string; // Default en DB
        };
        Update: {
          id?: string; // PK
          name?: string;
          code?: string | null;
          description?: string | null;
          institution_name?: string | null;
          lead_researcher_user_id?: string | null;
          status?: string;
          module_bibliography?: boolean;
          module_interviews?: boolean;
          module_planning?: boolean;
          // created_at no se actualiza
          updated_at?: string; // Se actualiza por trigger
        };
        Relationships: [
          {
            foreignKeyName: "projects_lead_researcher_user_id_fkey"; // Asume este nombre
            columns: ["lead_researcher_user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      project_roles: {
        // Anteriormente Rol, corregido de projects_roles
        Row: {
          id: string; // uuid, PK
          project_id: string; // uuid, NOT NULL, FK a projects(id)
          role_name: string; // text, NOT NULL
          role_description: string | null; // text, NULLABLE
          can_manage_master_data: boolean; // boolean, DEFAULT FALSE
          can_create_batches: boolean; // boolean, DEFAULT FALSE
          can_upload_files: boolean; // boolean, DEFAULT FALSE
          can_bulk_edit_master_data: boolean; // boolean, DEFAULT FALSE
          created_at: string; // timestamptz, DEFAULT now()
          updated_at: string; // timestamptz, DEFAULT now()
        };
        Insert: {
          id?: string; // Default en DB
          project_id: string; // Requerido
          role_name: string; // Requerido
          role_description?: string | null;
          can_manage_master_data?: boolean; // Default en DB
          can_create_batches?: boolean; // Default en DB
          can_upload_files?: boolean; // Default en DB
          can_bulk_edit_master_data?: boolean; // Default en DB
          created_at?: string; // Default en DB
          updated_at?: string; // Default en DB
        };
        Update: {
          id?: string; // PK
          project_id?: string; // Usualmente no se cambia, se borra y crea nuevo
          role_name?: string;
          role_description?: string | null;
          can_manage_master_data?: boolean;
          can_create_batches?: boolean;
          can_upload_files?: boolean;
          can_bulk_edit_master_data?: boolean;
          // created_at no se actualiza
          updated_at?: string; // Se actualiza por trigger
        };
        Relationships: [
          {
            foreignKeyName: "project_roles_project_id_fkey"; // Asume este nombre
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      project_members: {
        // Anteriormente proyecto_miembro, corregido de projects_members
        Row: {
          id: string; // uuid, PK
          project_id: string; // uuid, NOT NULL, FK a projects(id)
          user_id: string; // uuid, NOT NULL, FK a auth.users(id)
          project_role_id: string; // uuid, NOT NULL, FK a project_roles(id)
          is_active_for_user: boolean; // boolean, DEFAULT FALSE, NOT NULL
          ui_theme: string | null; // text, NULLABLE
          ui_font_pair: string | null; // text, NULLABLE
          ui_is_dark_mode: boolean; // boolean, DEFAULT FALSE
          contextual_notes: string | null; // text, NULLABLE
          contact_email_for_project: string | null; // text, NULLABLE
          joined_at: string; // timestamptz, DEFAULT now()
          updated_at: string; // timestamptz, DEFAULT now() (Ojo con trigger si usas este nombre)
        };
        Insert: {
          id?: string; // Default en DB
          project_id: string; // Requerido
          user_id: string; // Requerido
          project_role_id: string; // Requerido
          is_active_for_user?: boolean; // Default en DB
          ui_theme?: string | null;
          ui_font_pair?: string | null;
          ui_is_dark_mode?: boolean; // Default en DB
          contextual_notes?: string | null;
          contact_email_for_project?: string | null;
          joined_at?: string; // Default en DB
          updated_at?: string; // Default en DB
        };
        Update: {
          id?: string; // PK
          project_id?: string; // Usualmente no se cambia
          user_id?: string; // Usualmente no se cambia
          project_role_id?: string;
          is_active_for_user?: boolean;
          ui_theme?: string | null;
          ui_font_pair?: string | null;
          ui_is_dark_mode?: boolean;
          contextual_notes?: string | null;
          contact_email_for_project?: string | null;
          // joined_at no se actualiza
          updated_at?: string; // Podría actualizarse por trigger o manualmente
        };
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"; // Asume este nombre
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_members_user_id_fkey"; // Asume este nombre
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_members_project_role_id_fkey"; // Asume este nombre
            columns: ["project_role_id"];
            referencedRelation: "project_roles";
            referencedColumns: ["id"];
          }
        ];
      };
      // La tabla 'cargo' original ya no existe si la eliminamos con el script anterior.
      // Si la mantuviste o la renombraste, deberías añadirla aquí.
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_current_auth_context: {
        Args: Record<string, unknown>; // O {} si no acepta argumentos
        Returns: {
          current_uid: string | null;
          current_role: string | null;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
