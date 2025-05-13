// lib/database.types.ts

export interface Database {
  public: {
    Tables: {
      cargo: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          proyecto_id: string | null
          asignar_investigadores: boolean | null
          crear_lotes: boolean | null
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          proyecto_id?: string | null
          asignar_investigadores?: boolean | null
          crear_lotes?: boolean | null
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          proyecto_id?: string | null
          asignar_investigadores?: boolean | null
          crear_lotes?: boolean | null
        }
        Relationships: []
      }
      perfil_investigador: {
        Row: {
          user_id: string
          // **NOTA**: Aún incluye proyecto_id/cargo_id según tu SQL. Ajusta si es necesario.
          proyecto_id: string 
          nombre: string | null
          apellido: string | null
          institucion: string | null
          telefono: string | null
          notas: string | null
          cargo_id: string | null
        }
        Insert: {
          user_id: string
          proyecto_id: string
          nombre?: string | null
          apellido?: string | null
          institucion?: string | null
          telefono?: string | null
          notas?: string | null
          cargo_id?: string | null
        }
        Update: {
          user_id?: string
          proyecto_id?: string
          nombre?: string | null
          apellido?: string | null
          institucion?: string | null
          telefono?: string | null
          notas?: string | null
          cargo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfil_investigador_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfil_investigador_proyecto_id_fkey"
            columns: ["proyecto_id"]
            referencedRelation: "proyectos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfil_investigador_cargo_id_fkey"
            columns: ["cargo_id"]
            referencedRelation: "cargo"
            referencedColumns: ["id"]
          }
        ]
      }
      proyecto_miembro: {
        Row: {
          id: string
          proyecto_id: string
          user_id: string
          rol_en_proyecto: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          proyecto_id: string
          user_id: string
          rol_en_proyecto?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          proyecto_id?: string
          user_id?: string
          rol_en_proyecto?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_proyecto"
            columns: ["proyecto_id"]
            referencedRelation: "proyectos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      proyectos: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          created_at: string | null
          codigo: string | null
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          created_at?: string | null
          codigo?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          created_at?: string | null
          codigo?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      // ***** INICIO: DEFINICIÓN DE LA FUNCIÓN RPC *****
      get_current_auth_context: {
        Args: Record<string, unknown> // O {} si no acepta argumentos
        // Basado en la definición SQL con SETOF record y el SELECT interno
        Returns: { 
          current_uid: string | null
          current_role: string | null 
        }[] // Es un array porque usamos SETOF record
      }
      // ***** FIN: DEFINICIÓN DE LA FUNCIÓN RPC *****
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}