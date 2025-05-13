"use client";

import { useState } from "react";
import { ProTable } from "@/components/ui/pro-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { eliminarPerfilInvestigador } from "@/app/actions/perfil-investigador-actions";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface Investigador {
  id: string;
  user_id: string;
  proyecto_id: string;
  cargo_id: string;
  nombre: string;
  apellido: string;
  institucion?: string;
  telefono?: string;
  notas?: string;
  email?: string;
  cargo: {
    id: string;
    nombre: string;
    asignar_investigadores: boolean;
  };
}

interface TablaInvestigadoresProps {
  investigadores: Investigador[];
  cargando: boolean;
  tienePermiso: boolean;
  onEditar: (investigador: Investigador) => void;
  proyectoId: string;
}

export function TablaInvestigadores({
  investigadores,
  cargando,
  tienePermiso,
  onEditar,
  proyectoId
}: TablaInvestigadoresProps) {
  const [investigadorEliminar, setInvestigadorEliminar] = useState<Investigador | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  const confirmarEliminar = (investigador: Investigador) => {
    setInvestigadorEliminar(investigador);
  };

  const cancelarEliminar = () => {
    setInvestigadorEliminar(null);
    setError("");
  };

  const ejecutarEliminar = async () => {
    if (!investigadorEliminar) return;
    
    setEliminando(true);
    setError("");
    
    try {
      const result = await eliminarPerfilInvestigador(investigadorEliminar.id);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Actualizar la lista (la revalidación del servidor debería manejar esto)
        setInvestigadorEliminar(null);
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      setError("Error al eliminar el investigador. Por favor, intente de nuevo.");
    } finally {
      setEliminando(false);
    }
  };

  const columns: ColumnDef<Investigador, any>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: (info) => info.getValue(),
      meta: {
        enableSorting: true,
        className: "font-medium",
      },
    },
    {
      accessorKey: "apellido",
      header: "Apellido",
      cell: (info) => info.getValue(),
      meta: {
        enableSorting: true,
      },
    },
    {
      accessorKey: "institucion",
      header: "Institución",
      cell: (info) => info.getValue() || "-",
      meta: {
        enableSorting: true,
      },
    },
    {
      accessorKey: "cargo.nombre",
      header: "Cargo",
      cell: (info) => {
        const cargo = info.row.original.cargo?.nombre || "-";
        const tienePermiso = info.row.original.cargo?.asignar_investigadores;
        
        return (
          <div className="flex items-center gap-2">
            <Text variant="default">{cargo}</Text>
            {tienePermiso && (
              <Badge variant="success" className="ml-2">
                Admin
              </Badge>
            )}
          </div>
        );
      },
      meta: {
        enableSorting: true,
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => {
        const email = info.getValue() as string;
        
        return email ? (
          <a
            href={`mailto:${email}`}
            className="text-primary hover:underline"
          >
            {email}
          </a>
        ) : (
          <Text variant="default" className="text-neutral-500">
            -
          </Text>
        );
      },
      meta: {
        enableTooltip: true,
        lineClamp: 1,
      },
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "notas",
      header: "Notas",
      cell: (info) => {
        const notas = info.getValue() as string;
        return notas || "-";
      },
      meta: {
        enableTooltip: true,
        lineClamp: 1,
      },
    },
  ];

  // Solo agregar columna de acciones si el usuario tiene permisos
  if (tienePermiso) {
    columns.push({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const investigador = row.original;
        
        return (
          <div className="flex items-center gap-2 justify-end">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEditar(investigador)}
              className="h-8 w-8"
            >
              <Edit size={16} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => confirmarEliminar(investigador)}
              className="h-8 w-8 text-danger hover:text-danger"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        );
      },
      meta: {
        className: "w-24",
      },
    });
  }

  return (
    <>
      <ProTable
        data={investigadores}
        columns={columns}
        className="border"
      />

      <AlertDialog 
        open={investigadorEliminar !== null} 
        onOpenChange={(open) => !open && cancelarEliminar()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar al investigador{" "}
              <strong>
                {investigadorEliminar?.nombre} {investigadorEliminar?.apellido}
              </strong>
              ? Esta acción no se puede deshacer.
            </AlertDialogDescription>
            {error && (
              <Text variant="default" className="text-danger mt-2">
                {error}
              </Text>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={eliminando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                ejecutarEliminar();
              }}
              disabled={eliminando}
              className="bg-danger hover:bg-danger/90"
            >
              {eliminando ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
