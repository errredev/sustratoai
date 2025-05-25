// app/articulos/lotes/components/ProjectBatchesDisplay.tsx
"use client";

import React, { useState, useMemo } from "react";
import { ProCard } from "@/components/ui/pro-card";
import { Text } from "@/components/ui/text";
import { CustomButton } from "@/components/ui/custom-button";
import {
	AlertTriangle,
	Trash2,
	Clock,
	Zap,
	CheckCircle,
	AlertOctagon,
	HelpCircle,
	Layers,
} from "lucide-react";
import type { BatchStatusEnum } from "@/lib/database.types";
import { toast as sonnerToast } from "sonner";
import { BatchItem } from "./BatchItem";
import type { BatchAuxColor, BatchTokens } from "./batch-tokens";
import tinycolor from "tinycolor2";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { PageBackground } from "@/components/ui/page-background";
import { PageTitle } from "@/components/ui/page-title";

export interface DisplayableBatch {
	id: string;
	batch_number: number;
	name: string | null;
	status: BatchStatusEnum | string;
	assigned_to_member_id?: string | null;
	assigned_to_member_name?: string | null;
	article_count?: number;
}

interface ProjectBatchesDisplayProps {
	projectId: string;
	lotes: DisplayableBatch[];
	memberColorMap: Record<string, BatchAuxColor>;
	batchTokens: BatchTokens | null; // batchTokens todavía se usa para fallbackMemberColor y leyenda
	onResetAllBatches: () => Promise<{
		success: boolean;
		message?: string;
		error?: string;
	}>;
	permisoParaResetearGeneral: boolean;
}

// Iconos de estado (definidos localmente)
const statusIcons: Record<
	Extract<BatchStatusEnum, string> | "default",
	React.ReactNode
> = {
	pending: <Clock className="h-3 w-3" />,
	in_progress: <Zap className="h-3 w-3" />,
	ai_prefilled: (
		<CheckCircle className="h-3 w-3 text-purple-600 dark:text-purple-400" />
	),
	discrepancies: (
		<AlertOctagon className="h-3 w-3 text-orange-600 dark:text-orange-400" />
	),
	completed: (
		<CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
	),
	error: <AlertTriangle className="h-3 w-3 text-red-600 dark:text-red-400" />,
	default: <HelpCircle className="h-3 w-3" />,
};

// Clases de Tailwind para el Badge de estado (más simple)
const statusBadgeStyles: Record<
	Extract<BatchStatusEnum, string> | "default",
	string
> = {
	pending: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
	in_progress:
		"bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300",
	ai_prefilled:
		"bg-purple-100 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300",
	discrepancies:
		"bg-orange-100 text-orange-700 dark:bg-orange-700/30 dark:text-orange-300",
	completed:
		"bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300",
	error: "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300",
	default: "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200",
};

export default function ProjectBatchesDisplay({
	projectId,
	lotes,
	memberColorMap,
	batchTokens, // Se sigue necesitando para el fallback de color de miembro y la leyenda
	onResetAllBatches,
	permisoParaResetearGeneral,
}: ProjectBatchesDisplayProps) {
	const [isResetting, setIsResetting] = useState(false);

	const todosLosLotesEstanPendientes =
		lotes.length > 0 && lotes.every((lote) => lote.status === "pending");
	const mostrarBotonReset =
		permisoParaResetearGeneral && todosLosLotesEstanPendientes;

	const handleConfirmReset = async () => {
		const loteCount = lotes.length;
		const confirmado = window.confirm(
			`¿Estás SEGURO de que quieres eliminar TODOS los ${loteCount} lotes de este proyecto? ` +
				`Esta acción solo procederá si NINGÚN lote ha sido iniciado. No se puede deshacer.`
		);
		if (!confirmado) return;

		setIsResetting(true);
		const result = await onResetAllBatches();
		if (result.success) {
			sonnerToast.success("Reseteo Exitoso", {
				description: result.message || "Todos los lotes han sido eliminados.",
			});
		} else {
			sonnerToast.error("Error en el Reseteo", {
				description: result.error || "No se pudieron eliminar los lotes.",
			});
		}
		setIsResetting(false);
	};

	if (!batchTokens) {
		return (
			<ProCard>
				<ProCard.Content>
					<Text className="text-muted-foreground text-center p-4">
						Cargando estilos...
					</Text>
				</ProCard.Content>
			</ProCard>
		);
	}

	if (lotes.length === 0 && !isResetting) {
		return (
			<ProCard>
				<ProCard.Content className="text-center py-10">
					<Text
						variant="subheading"
						weight="medium"
						className="text-muted-foreground">
						No hay lotes creados para este proyecto.
					</Text>
					<Text size="sm" className="text-muted-foreground mt-2">
						El simulador debería estar visible para crear nuevos lotes.
					</Text>
				</ProCard.Content>
			</ProCard>
		);
	}

	const gridColumns = Math.min(
		12,
		Math.ceil(Math.sqrt(lotes.length * 1.2)) || 1
	);
	const fallbackMemberColor =
		batchTokens.auxiliaries.find((aux) => aux.key === "auxDefault") ||
		batchTokens.auxiliaries[0];

	return (
		<PageBackground>
			<div className="container mx-auto py-8">
				<PageTitle
					title="Lotes Creados en el Proyecto"
					subtitle={`Muestra los lotes creados en el proyecto.`}
					mainIcon={Layers}
					breadcrumbs={[
						{ label: "Datos maestros", href: "/datos-maestros" },
						{ label: "Lotes", href: "/datos-maestros/lote" },
					]}
				/>
				<ProCard
					variant="primary"
					border="top"
					borderVariant="neutral"
					shadow="md">
					<ProCard.Header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
						<div>
							<Text variant="heading" size="xl" weight="semibold" color="tertiary">
                            Total: {lotes.length} lotes.
							</Text>
						
						</div>
						{mostrarBotonReset && (
							<CustomButton
								color="danger"
								variant="outline"
								onClick={handleConfirmReset}
								loading={isResetting}
								disabled={isResetting}
								leftIcon={<Trash2 className="h-4 w-4" />}
								className="mt-3 sm:mt-0 pt-4">
								{isResetting
									? "Eliminando..."
									: "Eliminar Todos los Lotes Pendientes"}
							</CustomButton>
						)}
					</ProCard.Header>
					<ProCard.Content className="space-y-6">
						{/* Leyenda de Miembros */}
						{Object.keys(memberColorMap).length > 0 && (
							<div className="mb-6 p-3 border dark:border-neutral-700 rounded-md bg-background/30">
								<Text
									weight="medium"
									className="mb-2 text-sm text-muted-foreground">
									Leyenda de Miembros:
								</Text>
								<div className="flex flex-wrap gap-x-4 gap-y-2">
									{Object.entries(memberColorMap)
										.filter(([userId, _]) =>
											lotes.some(
												(lote) => lote.assigned_to_member_id === userId
											)
										)
										.map(([userId, colorInfo]) => {
											const memberFromLot = lotes.find(
												(l) => l.assigned_to_member_id === userId
											);
											const memberName =
												memberFromLot?.assigned_to_member_name ||
												`ID: ${userId.substring(0, 6)}`;
											if (!colorInfo) return null;
											return (
												<div key={userId} className="flex items-center gap-2">
													<div
														className="w-3 h-3 rounded-full"
														style={{
															backgroundColor: colorInfo.solid,
															border: `1px solid ${colorInfo.border}`,
														}}></div>
													<Text size="xs">{memberName}</Text>
												</div>
											);
										})}
								</div>
							</div>
						)}

						<div
							className={`grid gap-4 w-full items-start justify-center`}
							style={{
								gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
							}}>
							{lotes.map((lote) => {
								const memberColorInfo =
									lote.assigned_to_member_id &&
									memberColorMap[lote.assigned_to_member_id]
										? memberColorMap[lote.assigned_to_member_id]
										: fallbackMemberColor;

								const batchItemBgColor = memberColorInfo.solid;
								const batchItemInnerBorder = tinycolor(batchItemBgColor)
									.darken(15)
									.toHexString();
								const batchItemTextColor = memberColorInfo.text;

								const currentStatus = lote.status as Extract<
									BatchStatusEnum,
									string
								>; // Castear a los strings del enum
								const statusKeyToUse: keyof typeof statusIcons = // Usar el mismo tipo de clave que statusIcons
									statusIcons.hasOwnProperty(currentStatus)
										? currentStatus
										: "default";

								const statusIconToDisplay = statusIcons[statusKeyToUse];
								const badgeStyleClass = statusBadgeStyles[statusKeyToUse]; // Usar las clases de Tailwind

								const itemSize = Math.max(
									40,
									Math.min(65, (400 / gridColumns) * 0.9)
								);

								return (
									<TooltipProvider key={lote.id} delayDuration={200}>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="flex flex-col items-center gap-1.5 cursor-pointer group">
													<div
														className={`p-0.5 rounded-full border-2 border-transparent group-hover:border-primary/30 dark:group-hover:border-primary-dark/30 shadow-md transition-all group-hover:scale-105`}>
														<BatchItem
															color={batchItemBgColor}
															border={batchItemInnerBorder}
															textColor={batchItemTextColor}
															number={lote.batch_number}
															size={itemSize}
														/>
													</div>
													<Badge
														variant="default"
														className={`px-1.5 py-0.5 whitespace-nowrap text-center flex items-center justify-center gap-1 rounded-full ${badgeStyleClass}`}>
														{statusIconToDisplay}
														<span className="truncate max-w-[50px] sm:max-w-[60px] inline-block align-middle">
															{lote.status}
														</span>
													</Badge>
												</div>
											</TooltipTrigger>
											<TooltipContent
												className="text-xs"
												side="top"
												align="center">
												<Text weight="bold" className="block mb-0.5">
													Lote #{lote.batch_number}
													{lote.name ? `: ${lote.name}` : ""}
												</Text>
												<Text className="block">
													Asignado a: {lote.assigned_to_member_name || "N/A"}
												</Text>
												<Text className="block">
													Artículos: {lote.article_count ?? "N/A"}
												</Text>
												<Text className="block">Estado: {lote.status}</Text>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								);
							})}
						</div>

						{!mostrarBotonReset && lotes.length > 0 && (
							<div className="mt-6 p-3 bg-warning-50 dark:bg-warning-900/30 border-l-4 border-warning-500 dark:border-warning-400 rounded">
								<div className="flex">
									<div className="flex-shrink-0 pt-0.5">
										<AlertTriangle
											className="h-5 w-5 text-warning-600 dark:text-warning-400"
											aria-hidden="true"
										/>
									</div>
									<div className="ml-3">
										<Text
											weight="medium"
											className="text-warning-800 dark:text-warning-200">
											No se pueden eliminar los lotes masivamente
										</Text>
										<Text
											size="sm"
											className="text-warning-700 dark:text-warning-300">
											Uno o más lotes ya han sido iniciados (no están en estado
											'pending').
										</Text>
									</div>
								</div>
							</div>
						)}
					</ProCard.Content>
				</ProCard>
			</div>
		</PageBackground>
	);
}
