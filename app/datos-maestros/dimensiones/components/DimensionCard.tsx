// app/datos-maestros/dimensiones/components/DimensionCard.tsx
"use client";

import React from "react";
import { useRipple } from "@/components/ripple/RippleProvider";
import { useTheme } from "@/app/theme-provider";
import { type FullDimension } from "@/lib/actions/dimension-actions";
import { StandardCard, type StandardCardColorScheme } from "@/components/ui/StandardCard";
import { Text } from "@/components/ui/text";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { CustomButton } from "@/components/ui/custom-button";
import { PenLine, Trash2, Eye, GripVertical } from "lucide-react"; // GripVertical para drag handle
import { BadgeVariant } from "@/lib/theme/components/badge-tokens";
import { cn } from "@/lib/utils";
import { SustratoLoadingLogo } from "@/components/ui/sustrato-loading-logo";
// import { useSortable } from '@dnd-kit/sortable'; // Descomentar para dnd-kit
// import { CSS } from '@dnd-kit/utilities'; // Descomentar para dnd-kit

interface DimensionCardProps {
	dimension: FullDimension;
	onEdit: () => void;
	onDelete: () => void;
	onViewDetails: () => void;
	canManage: boolean;
	isBeingDeleted?: boolean;
}

export const DimensionCard: React.FC<DimensionCardProps> = ({
	dimension,
	onEdit,
	onDelete,
	onViewDetails,
	canManage,
	isBeingDeleted = false,
	// id, // para useSortable
}) => {
	// const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({id: id}); // Para dnd-kit
	// const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined, opacity: isDragging ? 0.8 : 1 }; // Para dnd-kit

	const tipoLabel =
		dimension.type === "finite" ? "Selección Múltiple" : "Respuesta Abierta";

	// Determinar variante de color para el borde y badge de tipo
	// Puedes ajustar esto según tu paleta de colores
	let cardColorVariant: BadgeVariant = "neutral";
	if (dimension.type === "finite")
		cardColorVariant = "success"; // ej. verde para finitas
	else if (dimension.type === "open") cardColorVariant = "info"; // ej. azul para abiertas

	const { appColorTokens, mode } = useTheme();
	const triggerRipple = useRipple();

	// Color para el ripple (accent background)
	const accentBg = appColorTokens?.accent?.bg || appColorTokens?.primary?.bg || "#4f46e5";

	const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
		triggerRipple(e, accentBg, 10);
		onViewDetails();
	};

	return (
		// <div ref={setNodeRef} style={style}> {/* Envolver con esto para dnd-kit */}
		<StandardCard
			styleType="subtle"
			className={cn(
				"flex flex-col h-full group relative", // StandardCard is already flex flex-col by default if not noStyles
				isBeingDeleted && "opacity-50 pointer-events-none"
			)}
			accentPlacement="left"
			colorScheme={cardColorVariant as any}
			accentColorScheme={cardColorVariant as any}
			shadow="md"
			animateEntrance
			onCardClick={handleCardClick} // Moved onClick here
			// The div that previously had onClick was p-4. StandardCard might have its own padding.
			// If p-4 is still desired for content area, it should be on StandardCard.Content or a wrapper inside.
			// For now, assuming StandardCard's default padding or noPadding is acceptable, or will be adjusted on subcomponents.
			// className="p-4" // This might be needed if StandardCard has no default padding or if we want to override it.
			// For now, let's assume the content below will be wrapped in StandardCard.Content which can handle padding.
		>
			{isBeingDeleted && (
				<div className="absolute inset-0 flex items-center justify-center bg-card/50 z-10">
					<SustratoLoadingLogo size={30} />
				</div>
			)}

			{/* The div that previously handled onClick is removed. Its content is now direct children or inside SC.Header/Content */}
			{/* The p-4 from the div is now handled by StandardCard.Content potentially, or needs to be added if card is noPadding */}
			<StandardCard.Header className="p-0 mb-2"> {/* Original ProCard.Header had p-0 */}
				<div className="flex flex-col gap-1">
					<div className="flex items-start justify-between">
						<Text
							variant="heading"
							size="md"
							weight="semibold"
							className="flex-grow mr-2"
							truncate
						>
							{dimension.name}
						</Text>
						<BadgeCustom variant={cardColorVariant} className="flex-shrink-0">
							{tipoLabel}
						</BadgeCustom>
					</div>
					{canManage && (
						<div className="flex justify-end gap-1 mt-1">
							<CustomButton
								size="sm"
								variant="ghost"
								iconOnly
								onClick={(e) => { e.stopPropagation(); onEdit(); }} // Stop propagation if inside clickable card
								disabled={isBeingDeleted}
								tooltip="Editar dimensión"
							>
								<PenLine className="h-5 w-5" />
							</CustomButton>
							<CustomButton
								size="sm"
								variant="ghost"
								iconOnly
								color="danger"
								onClick={(e) => { e.stopPropagation(); onDelete(); }} // Stop propagation
								disabled={isBeingDeleted}
								tooltip="Eliminar dimensión"
							>
								<Trash2 className="h-5 w-5" />
							</CustomButton>
						</div>
					)}
				</div>
			</StandardCard.Header>

			<StandardCard.Content className="p-0 flex-grow"> {/* Original ProCard.Content had p-0 */}
				{/* Eliminar padding por defecto */}
				{dimension.description && (
					<Text
						variant="default"
						color="muted"
						size="sm"
						className="mb-3 line-clamp-3">
						{" "}
						{/* Limitar líneas de descripción */}
						{dimension.description}
					</Text>
				)}
				{dimension.type === "finite" && dimension.options.length > 0 && (
					<div className="mb-3">
						<Text
							variant="label"
							size="xs"
							weight="medium"
							color="secondary"
							className="mb-1 block">
							Opciones Principales:
						</Text>
						<div className="flex flex-wrap gap-1">
							{dimension.options.slice(0, 4).map(
								(
									opt // Mostrar solo las primeras N opciones
								) => (
									<BadgeCustom key={opt.id} variant="neutral" subtle>
										{opt.value}
									</BadgeCustom>
								)
							)}
							{dimension.options.length > 4 && (
								<BadgeCustom variant="neutral" subtle>
									+{dimension.options.length - 4} más
								</BadgeCustom>
							)}
						</div>
					</div>
				)}
				{(dimension.questions.length > 0 ||
					dimension.examples.length > 0) && (
					<div className="mt-auto pt-2 text-xs text-muted-foreground space-y-0.5">
						{" "}
						{/* mt-auto para empujar al fondo si es flex-col */}
						{dimension.questions.length > 0 && (
							<div>{dimension.questions.length} Pregunta(s) Guía</div>
						)}
						{dimension.examples.length > 0 && (
							<div>{dimension.examples.length} Ejemplo(s) Ilustrativo(s)</div>
						)}
					</div>
				)}
				{dimension.type === "open" &&
					dimension.questions.length === 0 &&
					dimension.examples.length === 0 && (
						<Text
							variant="caption"
							color="muted"
							className="italic mt-auto pt-2">
							Esta dimensión abierta no tiene preguntas guía ni ejemplos
							definidos aún.
						</Text>
					)}
				{dimension.type === "finite" && dimension.options.length === 0 && (
					<Text
						variant="caption"
						color="warning"
						className="italic mt-auto pt-2">
						Esta dimensión de selección múltiple no tiene opciones definidas.
					</Text>
				)}
			</StandardCard.Content>
			{/* <StandardCard.Footer className="p-2"> // Footer was commented out
            <CustomButton variant="outline" size="sm" onClick={onViewDetails} leftIcon={<Eye className="h-4 w-4"/>}>
                Ver Detalles
            </CustomButton>
        </StandardCard.Footer> */}
		</StandardCard>
		// </div> // Cierre del div para dnd-kit
	);
};
