"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/pro-table";
import { Text } from "@/components/ui/text";
import type {
  TableVariant,
  TableSize,
} from "@/lib/theme/components/table-tokens";

const variants: TableVariant[] = ["default", "striped", "bordered"];
const sizes: TableSize[] = ["sm", "md", "lg"];

const sampleData = [
  { id: 1, nombre: "Juan Pérez", email: "juan@ejemplo.com", rol: "Admin" },
  { id: 2, nombre: "María García", email: "maria@ejemplo.com", rol: "Usuario" },
  { id: 3, nombre: "Carlos López", email: "carlos@ejemplo.com", rol: "Editor" },
  { id: 4, nombre: "Ana Martínez", email: "ana@ejemplo.com", rol: "Usuario" },
];

export default function TableShowroom() {
  const [selectedVariant, setSelectedVariant] =
    useState<TableVariant>("default");
  const [selectedSize, setSelectedSize] = useState<TableSize>("md");

  return (
    <div className="container mx-auto p-8 space-y-8">
      <Text variant="heading" size="2xl">
        Showroom de Tabla
      </Text>

      {/* Controles */}
      <div className="flex gap-4 mb-8">
        <div>
          <Text variant="label">Variante:</Text>
          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value as TableVariant)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            {variants.map((variant) => (
              <option key={variant} value={variant}>
                {variant}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Text variant="label">Tamaño:</Text>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value as TableSize)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de ejemplo */}
      <div className="border rounded-lg overflow-hidden">
        <Table variant={selectedVariant} size={selectedSize}>
          <TableCaption>Lista de usuarios de ejemplo</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.rol}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                <Text variant="muted">Total: {sampleData.length} usuarios</Text>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Tabla con datos más complejos */}
      <div className="mt-8">
        <Text variant="heading" size="xl" className="mb-4">
          Tabla con datos más complejos
        </Text>
        <div className="border rounded-lg overflow-hidden">
          <Table variant={selectedVariant} size={selectedSize}>
            <TableCaption>Datos financieros de ejemplo</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Categoría</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-03-15</TableCell>
                <TableCell>Compra de suministros</TableCell>
                <TableCell>$1,234.56</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-success/20 text-success">
                    Completado
                  </span>
                </TableCell>
                <TableCell>Gastos</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-03-14</TableCell>
                <TableCell>Venta de productos</TableCell>
                <TableCell>$5,678.90</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-warning/20 text-warning">
                    Pendiente
                  </span>
                </TableCell>
                <TableCell>Ingresos</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-03-13</TableCell>
                <TableCell>Pago de servicios</TableCell>
                <TableCell>$890.12</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-danger/20 text-danger">
                    Cancelado
                  </span>
                </TableCell>
                <TableCell>Gastos</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>
                  <Text variant="muted">Total de transacciones: 3</Text>
                </TableCell>
                <TableCell colSpan={3}>
                  <Text variant="muted">Balance neto: $3,554.22</Text>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}
