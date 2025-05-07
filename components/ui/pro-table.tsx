"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
  type RowData,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import { createPortal } from "react-dom"
import { useColorTokens } from "@/hooks/use-color-tokens"
import type { CellVariant } from "@/lib/theme/components/table-tokens"

// Declaración global para mouseX/mouseY para solucionar error de linter
declare global {
  interface Window {
    mouseX?: number
    mouseY?: number
  }
}

// Extendemos la definición de ColumnDef para incluir opciones adicionales
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    type?: string
    enableTooltip?: boolean
    enableSorting?: boolean
    className?: string
    isLongContent?: boolean
    lineClamp?: number // Añadimos la opción para controlar line-clamp a nivel de columna
    cellVariant?: CellVariant
  }
}

// Actualizar la interfaz ProTableProps para incluir la nueva propiedad
export interface TooltipTableProps<TData extends RowData> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  initialVisibility?: Record<string, boolean>
  className?: string
  enableTooltips?: boolean
  enableSorting?: boolean
  showColumnSelector?: boolean
  placeholder?: string
  getRowStatus?: (row: TData) => "success" | "warning" | "error" | "info" | "neutral" | "danger" | null
  lineClamp?: number // Añadimos la propiedad para controlar line-clamp a nivel de tabla
  tooltipDelay?: number // Añadimos un retraso configurable para el tooltip
}

// Componente de Tooltip separado para mejor manejo
interface TooltipComponentProps {
  content: React.ReactNode
  isLongContent: boolean
  onClose: () => void
  tooltipTokens: NonNullable<ReturnType<typeof useColorTokens>["component"]["table"]>["tooltip"]
}

const Tooltip: React.FC<TooltipComponentProps> = ({ content, isLongContent, onClose, tooltipTokens }) => {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // Calcular la posición óptima del tooltip
  useEffect(() => {
    if (!tooltipRef.current) return

    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let newTop, newLeft

    // Para contenido largo, centrar en la pantalla
    if (isLongContent) {
      newTop = Math.max(
        50,
        Math.min(viewportHeight - tooltipRect.height - 20, viewportHeight / 2 - tooltipRect.height / 2),
      )
      newLeft = Math.max(
        20,
        Math.min(viewportWidth - tooltipRect.width - 20, viewportWidth / 2 - tooltipRect.width / 2),
      )
    } else {
      // Para contenido normal, posicionar cerca del cursor pero asegurando que esté visible
      const cursorX = window.mouseX || viewportWidth / 2
      const cursorY = window.mouseY || viewportHeight / 2

      newTop = cursorY + 10
      newLeft = cursorX + 10

      // Ajustar si se sale de la pantalla
      if (newTop + tooltipRect.height > viewportHeight) {
        newTop = Math.max(10, cursorY - tooltipRect.height - 10)
      }
      if (newLeft + tooltipRect.width > viewportWidth) {
        newLeft = Math.max(10, cursorX - tooltipRect.width - 10)
      }
    }

    setPosition({ top: newTop, left: newLeft })
    setMounted(true)
  }, [isLongContent])

  // Manejar clic fuera del tooltip para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Crear un portal para renderizar el tooltip fuera del flujo normal del DOM
  return createPortal(
    <div
      ref={tooltipRef}
      className={`custom-tooltip ${isLongContent ? "custom-tooltip-large" : ""}`}
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxHeight: isLongContent ? "70vh" : "auto",
        maxWidth: isLongContent ? "60vw" : "24rem",
        overflowY: isLongContent ? "auto" : "visible",
        backgroundColor: tooltipTokens.backgroundColor,
        color: tooltipTokens.foregroundColor,
        border: `2px solid ${isLongContent ? tooltipTokens.borderColorLongContent : tooltipTokens.borderColor}`,
        borderRadius: "0.375rem",
        padding: "0.75rem",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
        zIndex: 9999,
        width: "max-content",
        whiteSpace: "pre-line",
        pointerEvents: isLongContent ? "auto" : "none",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.15s ease-out",
      }}
    >
      {content}
    </div>,
    document.body,
  )
}

// Actualizar la definición de la función para incluir el nuevo parámetro
export function ProTable<TData extends object>({
  data,
  columns,
  initialVisibility,
  className,
  enableTooltips = true,
  enableSorting = true,
  showColumnSelector = true,
  placeholder = "Buscar…",
  getRowStatus,
  lineClamp = 2, // Valor por defecto: 2 líneas
  tooltipDelay = 300, // Retraso por defecto: 300ms
}: TooltipTableProps<TData>) {
  const { component: componentTokens } = useColorTokens()
  const tableTokens = componentTokens.table
  const cellVariantTokens = tableTokens.cell.variants

  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(initialVisibility ?? {})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnSizing, setColumnSizing] = useState({})
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  // Estado para rastrear qué tooltip está activo
  const [activeTooltip, setActiveTooltip] = useState<{
    id: string
    content: React.ReactNode
    isLongContent: boolean
  } | null>(null)

  // Estado para rastrear sobre qué fila está el cursor
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)

  // Referencia para el temporizador del tooltip
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Almacenar la posición del mouse globalmente
  useEffect(() => {
    const trackMousePosition = (e: MouseEvent) => {
      window.mouseX = e.clientX
      window.mouseY = e.clientY
    }

    window.addEventListener("mousemove", trackMousePosition)
    return () => {
      window.removeEventListener("mousemove", trackMousePosition)
    }
  }, [])

  // Preparar las columnas para asegurarnos de que todas tengan enableResizing
  const preparedColumns = React.useMemo(() => {
    return columns.map((column) => ({ ...column, enableResizing: column.enableResizing ?? true }))
  }, [columns])

  const table = useReactTable({
    data,
    columns: preparedColumns,
    state: {
      columnVisibility,
      globalFilter,
      sorting,
      columnSizing,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => (row as any).subRows, // Configuración explícita para subfilas
  })

  // Calcular el ancho total de la tabla basado en las columnas visibles
  const tableWidth = React.useMemo(() => {
    return table.getAllColumns().reduce((acc, column) => {
      return acc + (column.getIsVisible() ? column.getSize() : 0)
    }, 0)
  }, [table, columnSizing, columnVisibility])

  // Efecto para medir el ancho del contenedor
  useEffect(() => {
    if (tableContainerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width)
        }
      })

      resizeObserver.observe(tableContainerRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [])

  // Determinar si la tabla debe expandirse para llenar el contenedor
  const shouldExpandTable = containerWidth > 0 && tableWidth < containerWidth

  // Función para obtener el contenido del tooltip
  const getTooltipContent = useCallback(
    (rowId: string, colId: string) => {
      // Encontrar la fila y la celda correspondientes
      const row = table.getRowModel().rowsById[rowId]
      if (!row) return null

      const cell = row.getAllCells().find((c) => c.column.id === colId)
      if (!cell) return null

      return flexRender(cell.column.columnDef.cell, cell.getContext())
    },
    [table],
  )

  // Función para determinar si una columna debe tener tooltip
  const shouldEnableFeature = useCallback(
    (columnId: string, feature: "enableTooltip" | "enableSorting", tableLevelEnable: boolean, metaOption?: boolean) => {
      if (!tableLevelEnable || columnId === "expander") return false
      const columnDef = preparedColumns.find((col) => col.id === columnId || (col as any).accessorKey === columnId)
      if (columnDef?.meta?.type === "actions") return false
      return metaOption !== undefined ? metaOption : true
    },
    [preparedColumns],
  )

  // Función para obtener el valor de line-clamp para una columna específica
  const getLineClampValue = useCallback(
    (columnId: string) => preparedColumns.find((col) => col.id === columnId || (col as any).accessorKey === columnId)?.meta?.lineClamp ?? lineClamp,
    [lineClamp, preparedColumns],
  )

  // Función para determinar si una columna tiene contenido largo
  const isColumnLongContent = useCallback(
    (columnId: string) => !!preparedColumns.find((col) => col.id === columnId || (col as any).accessorKey === columnId)?.meta?.isLongContent,
    [preparedColumns],
  )

  // Funciones para manejar eventos de tooltip con retraso
  const handleMouseEnterCell = (cellId: string, rowId: string, colId: string) => {
    // Limpiar cualquier temporizador existente
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current)
    }

    // Configurar un nuevo temporizador para mostrar el tooltip después del retraso
    tooltipTimerRef.current = setTimeout(() => {
      const content = getTooltipContent(rowId, colId)
      if (content) {
        setActiveTooltip({
          id: cellId,
          content,
          isLongContent: isColumnLongContent(colId),
        })
      }
    }, tooltipDelay)
  }

  const handleMouseLeaveCell = () => {
    // Limpiar el temporizador si el mouse sale antes de que se muestre el tooltip
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current)
      tooltipTimerRef.current = null
    }

    // No cerramos inmediatamente el tooltip para contenido largo
    // para permitir que el usuario interactúe con él
    if (activeTooltip && !activeTooltip.isLongContent) {
      setActiveTooltip(null)
    }
  }

  // Funciones para manejar eventos de fila
  const handleRowMouseEnter = (rowId: string) => {
    setHoveredRowId(rowId)
  }

  const handleRowMouseLeave = () => {
    setHoveredRowId(null)
  }

  // Manejador de teclas para accesibilidad
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+F para abrir el buscador
      if (e.altKey && e.key === "f") {
        e.preventDefault()
        const inputElement = document.querySelector<HTMLInputElement>('input[placeholder="' + placeholder + '"]')
        if (inputElement) {
          inputElement.focus()
        }
      }

      // Escape para cerrar el tooltip
      if (e.key === "Escape" && activeTooltip) {
        setActiveTooltip(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [placeholder, activeTooltip])

  // Modificar la función que determina la clase de la fila
  const getRowStyle = useCallback(
    (rowId: string, rowData?: TData): React.CSSProperties => {
      const isHovered = hoveredRowId === rowId
      let currentStatus = getRowStatus && rowData ? getRowStatus(rowData) : null
      if (currentStatus === "error") currentStatus = "danger"

      const defaultRowTokens = tableTokens.row.default
      let finalStyle: React.CSSProperties = {
        backgroundColor: isHovered ? defaultRowTokens.hoverBackgroundColor : defaultRowTokens.backgroundColor,
        borderBottom: `1px solid ${defaultRowTokens.borderColor}`,
        transition: "background-color 0.15s ease-out, color 0.15s ease-out",
      }

      if (currentStatus && tableTokens.row.status[currentStatus as keyof typeof tableTokens.row.status]) {
        const statusColors = tableTokens.row.status[currentStatus as keyof typeof tableTokens.row.status]
        finalStyle.backgroundColor = isHovered ? statusColors.hoverBackgroundColor : statusColors.backgroundColor
      }
      return finalStyle
    },
    [hoveredRowId, getRowStatus, tableTokens],
  )

  // Calcular el ancho de cada columna cuando la tabla debe expandirse
  const getColumnWidth = useCallback(
    (column: any) => {
      if (!shouldExpandTable) {
        return column.getSize()
      }

      // Calcular el factor de expansión
      const expansionFactor = containerWidth / tableWidth

      // Obtener el ancho original de la columna
      const originalWidth = column.getSize()

      // Calcular el nuevo ancho proporcional
      return Math.floor(originalWidth * expansionFactor)
    },
    [shouldExpandTable, containerWidth, tableWidth],
  )

  // Generar clases de line-clamp dinámicamente
  const getLineClampClass = useCallback((lcValue: number) => lcValue > 0 && lcValue <= 6 ? `line-clamp-${lcValue}` : (lcValue > 6 ? "custom-line-clamp" : ""), [])

  // Limpiar el temporizador del tooltip al desmontar el componente
  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current)
      }
    }
  }, [])

  if (!tableTokens || !cellVariantTokens) return null

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <Input
          placeholder={placeholder}
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full max-w-sm"
        />
        {/* Column picker */}
        {showColumnSelector && (
          <details className="ml-auto" role="group">
            <summary 
              className="cursor-pointer select-none text-sm"
              style={{ color: tableTokens.toolbar.columnSelector.foregroundColor }}
            >
              Columnas
            </summary>
            <div 
              className="mt-2 rounded-md p-2 shadow"
              style={{ backgroundColor: tableTokens.toolbar.columnSelector.backgroundColor }}
            >
              {table.getAllLeafColumns().map((col) => (
                <label 
                  key={col.id} 
                  className="flex items-center gap-2 text-sm py-1"
                  style={{ color: tableTokens.toolbar.columnSelector.foregroundColor }}
                >
                  <Checkbox checked={col.getIsVisible()} onCheckedChange={() => col.toggleVisibility()} />
                  {col.id}
                </label>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Estilos para line-clamp personalizado */}
      {lineClamp > 6 && (
        <style jsx global>{`
          .custom-line-clamp {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: ${lineClamp};
            overflow: hidden;
          }
        `}</style>
      )}

      {/* Tabla */}
      <div
        ref={tableContainerRef}
        className="relative overflow-auto rounded-lg"
        style={{
          maxWidth: "100%",
          overflowX: "auto",
          overflowY: "auto",
          backgroundColor: tableTokens.container.backgroundColor,
          border: `1px solid ${tableTokens.container.borderColor}`,
        }}
      >
        <div
          style={{
            width: shouldExpandTable ? "100%" : `${Math.max(tableWidth, 800)}px`,
            minWidth: shouldExpandTable ? "100%" : `${Math.max(tableWidth, 800)}px`,
          }}
        >
          <table
            className="w-full text-sm text-ui-text-secondary"
            role="table"
            style={{
              borderCollapse: "separate",
              borderSpacing: 0,
              width: "100%",
              backgroundColor: tableTokens.container.backgroundColor,
            }}
          >
            <thead className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isSortable = shouldEnableFeature(header.column.id, "enableSorting", enableSorting, header.column.columnDef.meta?.enableSorting)
                    const sortDirection = header.column.getIsSorted()

                    return (
                      <th
                        key={header.id}
                        style={{
                          width: getColumnWidth(header.column),
                          position: "relative",
                          borderRight: `1px solid ${tableTokens.header.borderColor}`,
                          borderBottom: `1px solid ${tableTokens.header.borderColor}`,
                          padding: '0.75rem 0.5rem',
                          textAlign: 'center',
                          color: tableTokens.header.foregroundColor,
                          backgroundColor: tableTokens.header.backgroundColor,
                          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                          whiteSpace: 'nowrap',
                          userSelect: 'none',
                        }}
                        className={cn(
                          "group",
                          header.column.columnDef.meta?.className,
                        )}
                        role="columnheader"
                      >
                        <div className="flex items-center justify-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}

                          {/* Icono de ordenamiento */}
                          {isSortable && (
                            <button
                              onClick={() => header.column.toggleSorting()}
                              className="ml-1 rounded-sm focus:outline-none focus:ring-2"
                              style={{
                                color: sortDirection ? tableTokens.header.sortIconHoverColor : tableTokens.header.sortIconColor,
                              }}
                              aria-label={
                                sortDirection === "asc"
                                  ? "Ordenado ascendente, haz clic para ordenar descendente"
                                  : sortDirection === "desc"
                                    ? "Ordenado descendente, haz clic para quitar ordenamiento"
                                    : "Sin ordenar, haz clic para ordenar ascendente"
                              }
                            >
                              {sortDirection === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : sortDirection === "desc" ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronsUpDown className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Resizer */}
                        {header.column.getCanResize() && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className="absolute right-0 top-0 h-full w-2 cursor-col-resize opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Arrastrar para redimensionar"
                            style={{
                              backgroundColor: tableTokens.header.resizeHandleColor,
                            }}
                          >
                            <div 
                              className="absolute right-0 top-0 h-full w-[3px]"
                              style={{ backgroundColor: tableTokens.header.resizeHandleColor }}
                            ></div>
                          </div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody role="rowgroup">
              {table.getRowModel().rows.map((row) => {
                // Verificar si esta fila es una subfila que ya está siendo mostrada en otra parte
                const isSubRow = data.some(
                  (item: any) =>
                    item.subRows && item.subRows.some((subRow: any) => subRow.id === (row.original as any).id),
                )

                // Si es una subfila que ya se muestra en otra parte, no renderizarla como fila principal
                if (isSubRow) {
                  return null
                }

                const rowStyle = getRowStyle(row.id, row.original as TData)

                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className={cn("transition-colors", row.getCanExpand() ? "cursor-pointer" : "")}
                      style={rowStyle}
                      role="row"
                      onMouseEnter={() => handleRowMouseEnter(row.id)}
                      onMouseLeave={handleRowMouseLeave}
                      onClick={row.getCanExpand() ? row.getToggleExpandedHandler() : undefined}
                    >
                      {row.getVisibleCells().map((cell, cellIndex) => {
                        const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext())
                        const isCellTooltipEnabled = shouldEnableFeature(cell.column.id, "enableTooltip", enableTooltips, cell.column.columnDef.meta?.enableTooltip)
                        const cellLineClamp = getLineClampValue(cell.column.id)
                        const cellLineClampClass = getLineClampClass(cellLineClamp)
                        const isLastCell = cellIndex === row.getVisibleCells().length - 1
                        const cellVariantKey = cell.column.columnDef.meta?.cellVariant as CellVariant | undefined

                        let individualCellStyle: React.CSSProperties = {
                          padding: "0.75rem 0.5rem",
                          verticalAlign: "top",
                          borderRight: isLastCell ? undefined : `1px solid ${tableTokens.cell.borderColor}`,
                          width: getColumnWidth(cell.column),
                          transition: "background-color 0.15s ease-out, color 0.15s ease-out",
                        }

                        if (cellVariantKey && cellVariantTokens[cellVariantKey]) {
                          const variantToken = cellVariantTokens[cellVariantKey]
                          individualCellStyle.backgroundColor = rowStyle.backgroundColor
                          individualCellStyle.color = variantToken.foregroundColor
                        } else {
                          if (rowStyle.color && rowStyle.backgroundColor !== tableTokens.row.default.backgroundColor && rowStyle.backgroundColor !== tableTokens.row.default.hoverBackgroundColor) {
                            individualCellStyle.color = rowStyle.color
                          } else {
                            individualCellStyle.color = tableTokens.cell.foregroundColor
                          }
                        }

                        return (
                          <td
                            key={cell.id}
                            className={cn(cell.column.columnDef.meta?.className, "align-top")}
                            role="cell"
                            style={individualCellStyle}
                            onMouseEnter={isCellTooltipEnabled ? () => handleMouseEnterCell(`tooltip-${row.id}-${cell.column.id}`, row.id, cell.column.id) : undefined}
                            onMouseLeave={isCellTooltipEnabled ? handleMouseLeaveCell : undefined}
                          >
                            <div className={`break-words max-w-xs ${cellLineClampClass}`}>
                              {cellLineClamp > 6 && (
                                <div
                                  style={{
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: cellLineClamp,
                                    overflow: "hidden",
                                  }}
                                >
                                  {cellContent}
                                </div>
                              )}
                              {cellLineClamp <= 6 && cellContent}
                            </div>
                          </td>
                        )
                      })}
                    </tr>

                    {/* Filas anidadas (accordion) */}
                    {row.getIsExpanded() && row.subRows && row.subRows.length > 0 && (
                      <tr 
                        style={{
                          backgroundColor: tableTokens.row.subRowBackgroundColor,
                          borderBottom: `1px solid ${tableTokens.row.default.borderColor}`
                        }}
                      >
                        <td colSpan={row.getVisibleCells().length} className="p-3">
                          <div 
                            className="pl-4"
                            style={{
                              borderLeft: `2px solid ${tableTokens.row.subRowIndentBorderColor}`
                            }}
                          >
                            {/* Renderizar subfilas como una tabla anidada */}
                            <table className="w-full text-sm">
                              <tbody>
                                {row.subRows.map((subRow) => {
                                  const subRowStyle = getRowStyle(subRow.id, subRow.original as TData)
                                  return (
                                  <tr
                                    key={subRow.id}
                                    style={subRowStyle}
                                    onMouseEnter={() => handleRowMouseEnter(subRow.id)}
                                    onMouseLeave={handleRowMouseLeave}
                                  >
                                    {subRow.getVisibleCells().map((cell, cellIndex) => {
                                      const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext())
                                      const isCellTooltipEnabled = shouldEnableFeature(cell.column.id, "enableTooltip", enableTooltips, cell.column.columnDef.meta?.enableTooltip)
                                      const cellLineClamp = getLineClampValue(cell.column.id)
                                      const cellLineClampClass = getLineClampClass(cellLineClamp)
                                      const isLastCell = cellIndex === subRow.getVisibleCells().length - 1
                                      const subCellVariantKey = cell.column.columnDef.meta?.cellVariant as CellVariant | undefined

                                      let subIndividualCellStyle: React.CSSProperties = {
                                        padding: "0.75rem 0.5rem",
                                        verticalAlign: "top",
                                        borderRight: isLastCell ? undefined : `1px solid ${tableTokens.cell.borderColor}`,
                                        width: getColumnWidth(cell.column),
                                        transition: "background-color 0.15s ease-out, color 0.15s ease-out",
                                      }
                                      
                                      const currentSubRowStyle = getRowStyle(subRow.id, subRow.original as TData)
                                      const isSubRowHovered = hoveredRowId === subRow.id

                                      if (subCellVariantKey && cellVariantTokens[subCellVariantKey]) {
                                        const variantToken = cellVariantTokens[subCellVariantKey]
                                        subIndividualCellStyle.backgroundColor = isSubRowHovered && variantToken.hoverBackgroundColor
                                                                                ? variantToken.hoverBackgroundColor
                                                                                : variantToken.backgroundColor
                                        subIndividualCellStyle.color = variantToken.foregroundColor
                                      } else {
                                        if (currentSubRowStyle.color && currentSubRowStyle.backgroundColor !== tableTokens.row.default.backgroundColor && currentSubRowStyle.backgroundColor !== tableTokens.row.default.hoverBackgroundColor) {
                                            subIndividualCellStyle.color = currentSubRowStyle.color
                                        } else {
                                            subIndividualCellStyle.color = tableTokens.cell.foregroundColor
                                        }
                                      }

                                      return (
                                        <td
                                          key={cell.id}
                                          className={cn(cell.column.columnDef.meta?.className, "align-top")}
                                          style={subIndividualCellStyle}
                                          onMouseEnter={isCellTooltipEnabled ? () => handleMouseEnterCell(`tooltip-${subRow.id}-${cell.column.id}`, subRow.id, cell.column.id) : undefined}
                                          onMouseLeave={isCellTooltipEnabled ? handleMouseLeaveCell : undefined}
                                        >
                                          <div className={`break-words max-w-xs ${cellLineClampClass}`}>
                                            {cellLineClamp > 6 && (
                                              <div
                                                style={{
                                                  display: "-webkit-box",
                                                  WebkitBoxOrient: "vertical",
                                                  WebkitLineClamp: cellLineClamp,
                                                  overflow: "hidden",
                                                }}
                                              >
                                                {cellContent}
                                              </div>
                                            )}
                                            {cellLineClamp <= 6 && cellContent}
                                          </div>
                                        </td>
                                      )
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Tooltip usando el componente separado */}
        {activeTooltip && tableTokens.tooltip && (
          <Tooltip
            content={activeTooltip.content}
            isLongContent={activeTooltip.isLongContent}
            onClose={() => setActiveTooltip(null)}
            tooltipTokens={tableTokens.tooltip}
          />
        )}
      </div>
    </div>
  )
}
