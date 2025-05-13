"use client";

import React from "react";
import { ProTable } from "@/components/ui/pro-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button"; // Para acciones
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Definición de la interfaz Person
interface Person {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: "relationship" | "complicated" | "single";
  progress: number;
  email: string;
  role: "Admin" | "User" | "Editor" | "Viewer";
  department: string;
  lastLogin: string;
  notes?: string;
  subRows?: Person[];
}

// Datos de ejemplo
const defaultData: Person[] = [
  {
    id: "1",
    firstName: "Ana",
    lastName: "García",
    age: 34,
    visits: 120,
    status: "relationship",
    progress: 85,
    email: "ana.garcia@example.com",
    role: "Admin",
    department: "Desarrollo",
    lastLogin: "2023-10-26T10:30:00Z",
    notes:
      "Líder técnica del equipo de frontend. Amplia experiencia en React y Next.js. Responsable de la arquitectura de la nueva plataforma de usuarios. Esta nota es intencionalmente larga para demostrar cómo el componente ProTable maneja el contenido extenso a través de tooltips y line-clamp, asegurando que la interfaz se mantenga limpia y la información completa sea accesible.",
    subRows: [
      {
        id: "1-1",
        firstName: "Carlos",
        lastName: "Ruiz",
        age: 28,
        visits: 30,
        status: "single",
        progress: 60,
        email: "carlos.ruiz@example.com",
        role: "User",
        department: "Desarrollo",
        lastLogin: "2023-10-25T14:00:00Z",
        notes: "Desarrollador Frontend. Especializado en UI/UX.",
      },
      {
        id: "1-2",
        firstName: "Laura",
        lastName: "Jiménez",
        age: 25,
        visits: 15,
        status: "single",
        progress: 40,
        email: "laura.jimenez@example.com",
        role: "User",
        department: "Desarrollo",
        lastLogin: "2023-10-24T09:15:00Z",
        notes: "Desarrolladora Junior. Aprendiendo rápido.",
      },
    ],
  },
  {
    id: "2",
    firstName: "Luis",
    lastName: "Martínez",
    age: 42,
    visits: 250,
    status: "complicated",
    progress: 30,
    email: "luis.martinez@example.com",
    role: "Editor",
    department: "Marketing",
    lastLogin: "2023-09-15T11:00:00Z",
    notes:
      "Encargado de la estrategia de contenidos. Tiene un blog muy popular sobre marketing digital.",
  },
  {
    id: "3",
    firstName: "Sofía",
    lastName: "Hernández",
    age: 29,
    visits: 80,
    status: "single",
    progress: 70,
    email: "sofia.hernandez@example.com",
    role: "User",
    department: "Soporte",
    lastLogin: "2023-10-20T16:45:00Z",
    notes: "Especialista en soporte técnico nivel 2.",
  },
  {
    id: "4",
    firstName: "Javier",
    lastName: "López",
    age: 50,
    visits: 180,
    status: "relationship",
    progress: 95,
    email: "javier.lopez@example.com",
    role: "Admin",
    department: "Operaciones",
    lastLogin: "2023-10-26T08:00:00Z",
    notes:
      "Director de Operaciones. Supervisa múltiples departamentos. Siempre busca optimizar procesos.",
  },
  {
    id: "5",
    firstName: "Elena",
    lastName: "Pérez",
    age: 22,
    visits: 5,
    status: "single",
    progress: 15,
    email: "elena.perez@example.com",
    role: "Viewer",
    department: "Ventas",
    lastLogin: "2023-08-01T12:30:00Z",
    notes: "Becaria en el departamento de ventas. Mucho potencial.",
  },
  {
    id: "6",
    firstName: "María",
    lastName: "Domínguez",
    age: 32,
    visits: 75,
    status: "relationship",
    progress: 60,
    email: "maria.dominguez@example.com",
    role: "Admin",
    department: "Diseño",
    lastLogin: "2023-10-10T09:30:00Z",
    notes: "Diseñadora principal. Responsable de la identidad visual.",
    subRows: [
      {
        id: "6-1",
        firstName: "Pedro",
        lastName: "Sánchez",
        age: 28,
        visits: 20,
        status: "single",
        progress: 40,
        email: "pedro.sanchez@example.com",
        role: "User",
        department: "Diseño",
        lastLogin: "2023-10-05T11:45:00Z",
        notes: "Diseñador UI/UX junior.",
      },
    ],
  },
  {
    id: "7",
    firstName: "Variante",
    lastName: "Primary",
    age: 35,
    visits: 100,
    status: "relationship",
    progress: 50,
    email: "primary@example.com",
    role: "Admin",
    department: "Desarrollo",
    lastLogin: "2023-10-01T10:00:00Z",
    notes: "Ejemplo de fila con estilo primary",
  },
  {
    id: "8",
    firstName: "Variante",
    lastName: "Secondary",
    age: 35,
    visits: 100,
    status: "relationship",
    progress: 50,
    email: "secondary@example.com",
    role: "Admin",
    department: "Desarrollo",
    lastLogin: "2023-10-01T10:00:00Z",
    notes: "Ejemplo de fila con estilo secondary",
  },
  {
    id: "9",
    firstName: "Variante",
    lastName: "Tertiary",
    age: 35,
    visits: 100,
    status: "relationship",
    progress: 50,
    email: "tertiary@example.com",
    role: "Admin",
    department: "Desarrollo",
    lastLogin: "2023-10-01T10:00:00Z",
    notes: "Ejemplo de fila con estilo tertiary",
  },
  {
    id: "10",
    firstName: "Variante",
    lastName: "Accent",
    age: 35,
    visits: 100,
    status: "relationship",
    progress: 50,
    email: "accent@example.com",
    role: "Admin",
    department: "Desarrollo",
    lastLogin: "2023-10-01T10:00:00Z",
    notes: "Ejemplo de fila con estilo accent",
  },
  {
    id: "11",
    firstName: "Variante",
    lastName: "Success",
    age: 35,
    visits: 100,
    status: "relationship",
    progress: 90,
    email: "success@example.com",
    role: "Admin",
    department: "Desarrollo",
    lastLogin: "2023-10-01T10:00:00Z",
    notes: "Ejemplo de fila con estilo success",
  },
  {
    id: "12",
    firstName: "Variante",
    lastName: "Warning",
    age: 35,
    visits: 100,
    status: "relationship",
    progress: 50,
    email: "warning@example.com",
    role: "Admin",
    department: "Desarrollo",
    lastLogin: "2023-10-01T10:00:00Z",
    notes: "Ejemplo de fila con estilo warning",
  },
  {
    id: "13",
    firstName: "Variante",
    lastName: "Danger",
    age: 35,
    visits: 100,
    status: "complicated",
    progress: 20,
    email: "danger@example.com",
    role: "Admin",
    department: "Desarrollo",
    lastLogin: "2023-10-01T10:00:00Z",
    notes: "Ejemplo de fila con estilo danger",
  },
  {
    id: "14",
    firstName: "Ejemplo",
    lastName: "SubFilas",
    age: 35,
    visits: 100,
    status: "relationship",
    progress: 50,
    email: "subfilas@example.com",
    role: "Admin",
    department: "Desarrollo",
    lastLogin: "2023-10-01T10:00:00Z",
    notes: "Ejemplo para probar subfilas",
    subRows: [
      {
        id: "14-1",
        firstName: "SubFila",
        lastName: "Uno",
        age: 25,
        visits: 10,
        status: "single",
        progress: 30,
        email: "subfila1@example.com",
        role: "User",
        department: "Desarrollo",
        lastLogin: "2023-10-01T10:00:00Z",
        notes: "Primera subfila de ejemplo",
      },
    ],
  },
];

// Función para formatear fechas
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      // hour: "2-digit", // Descomentar si se quiere hora
      // minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Fecha inválida";
  }
};

// Definición de columnas
const columns: ColumnDef<Person, any>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <div className="flex items-center justify-center w-full h-full">
          <motion.div
            initial={false}
            animate={{ rotate: row.getIsExpanded() ? 90 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <ChevronRight size={18} className="text-primary" />
          </motion.div>
        </div>
      ) : null,
    meta: {
      className: "w-10 text-center",
    },
  },
  {
    accessorKey: "firstName",
    header: "Nombre",
    cell: (info) => info.getValue(),
    meta: {
      enableSorting: true,
      className: "font-medium",
    },
  },
  {
    accessorKey: "lastName",
    header: "Apellido",
    cell: (info) => info.getValue(),
    meta: {
      enableSorting: true,
    },
  },
  {
    accessorKey: "age",
    header: "Edad",
    cell: (info) => info.getValue(),
    meta: {
      enableSorting: true,
      className: "text-center",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => (
      <a
        href={`mailto:${info.getValue() as string}`}
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {info.getValue() as string}
      </a>
    ),
    meta: {
      enableTooltip: true,
      lineClamp: 1,
      cellVariant: (info) => {
        if (info.getValue() === "maria.dominguez@example.com") {
          return "accent";
        }
        if (info.getValue() === "javier.lopez@example.com") {
          return "success";
        }
        return undefined;
      },
    },
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: (info) => {
      const role = info.getValue() as Person["role"];
      let badgeVariant:
        | "default"
        | "secondary"
        | "destructive"
        | "outline"
        | "info"
        | "success"
        | "warning" = "default";
      if (role === "Admin") badgeVariant = "destructive";
      else if (role === "Editor") badgeVariant = "info";
      else if (role === "User") badgeVariant = "success";
      else if (role === "Viewer") badgeVariant = "secondary";
      return (
        <Badge variant={badgeVariant} className="capitalize">
          {role}
        </Badge>
      );
    },
    meta: {
      enableSorting: true,
      className: "text-center",
    },
  },
  {
    accessorKey: "department",
    header: "Departamento",
    cell: (info) => info.getValue(),
    meta: {
      enableSorting: true,
    },
  },
  {
    accessorKey: "visits",
    header: "Visitas",
    cell: (info) => (
      <div className="text-right">{info.getValue() as number}</div>
    ),
    meta: {
      enableSorting: true,
      className: "text-right",
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: (info) => {
      const status = info.getValue() as Person["status"];
      let cellVariant =
        status === "relationship"
          ? "primary"
          : status === "complicated"
          ? "danger"
          : status === "single"
          ? "secondary"
          : "neutral";

      return (
        <div
          className="text-center font-medium"
          style={{
            backgroundColor: info.row.getIsSelected()
              ? "rgba(0,0,0,0.1)"
              : "transparent",
          }}
        >
          {status}
        </div>
      );
    },
    meta: {
      enableSorting: true,
      className: "text-center",
      cellVariant: (info) => {
        const status = info.getValue() as Person["status"];
        return status === "relationship"
          ? "primary"
          : status === "complicated"
          ? "danger"
          : status === "single"
          ? "secondary"
          : undefined;
      },
    },
  },
  {
    accessorKey: "progress",
    header: () => <div className="text-center">Progreso</div>,
    cell: (info) => {
      const value = info.getValue() as number;
      return (
        <div className="w-full">
          <Progress value={value} className="w-full min-w-[100px]" />
          {value > 0 && (
            <div className="text-xs mt-1 text-center">
              <Badge
                variant={
                  value > 70
                    ? "success"
                    : value < 30
                    ? "destructive"
                    : "default"
                }
                className="px-1 py-0"
              >
                {value}%
              </Badge>
            </div>
          )}
        </div>
      );
    },
    meta: {
      enableSorting: true,
      className: "text-center",
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Último Login",
    cell: (info) => formatDate(info.getValue() as string | undefined),
    meta: {
      enableSorting: true,
      className: "min-w-[120px]",
    },
  },
  {
    accessorKey: "notes",
    header: "Notas",
    // cell: (info) => <div className="max-w-xs">{info.getValue() as string}</div>, // ProTable maneja el lineClamp internamente
    cell: (info) => info.getValue(),
    meta: {
      enableTooltip: true,
      isLongContent: true,
      lineClamp: 2, // ProTable usará esto
      className: "min-w-[200px] max-w-sm", // Permite que la columna se expanda un poco
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center space-x-1 md:space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => alert(`Viendo perfil de: ${row.original.firstName}`)}
        >
          Ver
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700"
          onClick={() =>
            confirm(
              `¿Seguro que quieres eliminar a ${row.original.firstName}?`
            ) && alert(`${row.original.firstName} eliminado (simulación).`)
          }
        >
          Eliminar
        </Button>
      </div>
    ),
    meta: {
      type: "actions",
      enableSorting: false,
      enableTooltip: false,
      isFixed: true, // Añadimos esta propiedad para fijar la columna
      className: "text-center sticky right-0 bg-background z-[1] shadow-sm",
    },
  },
];

// Función getRowStatus
const getRowStatus = (
  row: Person
):
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "danger"
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | null => {
  // Solo mostrar log para Sofía
  if (row.firstName === "Sofía") {
    console.log("🔍 getRowStatus para Sofía:", row);
  }

  // Variantes específicas basadas en ID
  if (row.id === "7") return "primary";
  if (row.id === "8") return "secondary";
  if (row.id === "9") return "tertiary";
  if (row.id === "10") return "accent";
  if (row.id === "11") return "success";
  if (row.id === "12") return "warning";
  if (row.id === "13") return "danger";

  // Mantener la lógica original
  if (row.progress > 80) return "success";
  if (row.visits < 20 && row.age < 25 && row.role === "Viewer")
    return "warning";
  if (row.status === "complicated") return "danger";
  if (row.role === "Admin") return "info";
  return null;
};

const ProTableShowroomPage: React.FC = () => {
  return (
    <PageWrapper
      title="Showroom de ProTable"
      className="container mx-auto px-4 py-8"
    >
      <Text variant="heading" as="h1" className="mb-4">
        Demostración Avanzada de <code>ProTable</code>
      </Text>

      <Text variant="default" className="mb-6 text-lg text-muted-foreground">
        Explora las capacidades del componente <code>ProTable</code>. Esta tabla
        interactiva muestra características clave diseñadas para la
        visualización y gestión eficiente de datos.
      </Text>

      <div className="mb-8 p-4 border rounded-lg bg-card shadow">
        <Text variant="title" as="h2" className="mb-3">
          Funcionalidades Destacadas:
        </Text>
        <ul className="list-disc list-inside space-y-1 text-sm text-card-foreground">
          <li>Filtro global para búsquedas rápidas.</li>
          <li>Selector de columnas para personalizar la vista.</li>
          <li>Ordenación interactiva por múltiples columnas.</li>
          <li>
            Tooltips informativos al pasar el cursor (normales y extensos).
          </li>
          <li>
            Control de truncamiento de texto con <code>lineClamp</code>.
          </li>
          <li>Soporte para filas anidadas (sub-filas) expandibles.</li>
          <li>
            Indicadores visuales de estado por fila (<code>getRowStatus</code>).
          </li>
          <li>Integración de componentes UI como Badges y Progress bars.</li>
          <li>Columna de acciones con botones interactivos.</li>
          <li>Redimensionamiento de columnas arrastrando los bordes.</li>
          <li>Columna de acciones fija a la derecha (sticky).</li>
        </ul>
      </div>

      <ProTable<Person>
        data={defaultData}
        columns={columns}
        enableTooltips={true}
        enableSorting={true}
        showColumnSelector={true}
        placeholder="Buscar en toda la tabla..."
        getRowStatus={getRowStatus}
        lineClamp={1}
        tooltipDelay={250}
        stickyHeader={true}
        initialVisibility={{
          department: false,
        }}
        className="mt-4 border rounded-lg shadow-lg overflow-hidden max-h-[700px]"
      />
    </PageWrapper>
  );
};

export default ProTableShowroomPage;
