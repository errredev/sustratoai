// app/datos-maestros/lote/components/batch-tokens.ts
"use client";

import type { AppColorTokens, Mode, ColorShade } from "@/lib/theme/ColorToken";
import type { BatchStatusEnum } from '@/lib/database.types';
import tinycolor from "tinycolor2";

export type BatchMemberColorKey = "aux1" | "aux2" | "aux3" | "aux4" | "aux5" | "auxDefault";

export interface BatchAuxColor {
	key: BatchMemberColorKey;
	solid: string;
	gradient: string;
	text: string;
	border: string;
	name: string;
}

// Tipo para las claves de estado que vamos a mapear
export type BatchStatusTokenKey = BatchStatusEnum | 'default';

export interface BatchTokens {
	auxiliaries: BatchAuxColor[]; 
    // NUEVO: Mapeo de estado a una clave de AppColorTokens (o directamente a ColorShade)
    statusShades: Record<BatchStatusTokenKey, ColorShade>; 
	batch: { 
		background: string; 
	};
    pesoLote: {
        barBackground: string;
        barFill: string;
        containerBorder: string;
    };
}

// --- Función para generar paleta de miembros (SIN CAMBIOS) ---
function generatePastelPalette(baseColor: string, count: number): BatchAuxColor[] {
  // ... tu código existente ...
	const names = ["Lote Azul","Lote Rosado","Lote Amarillo","Lote Verde","Lote Celeste",];
	return Array.from({ length: count }).map((_, i) => {
		const pastel = tinycolor(baseColor).spin((i * 360) / count).saturate(-30).lighten(35).toHexString();
		const pastel2 = tinycolor(pastel).lighten(10).toHexString();
		return {
			key: ("aux" + (i + 1)) as BatchMemberColorKey,
			solid: pastel,
			gradient: `linear-gradient(135deg, ${pastel} 0%, ${pastel2} 100%)`,
			text: tinycolor.mostReadable(pastel, ["#222", "#fff"]).toHexString(),
			border: tinycolor(pastel).darken(10).toHexString(),
			name: names[i] || `Lote ${i + 1}`,
		};
	});
}

// --- NUEVO: Función SIMPLIFICADA para generar mapeo de estado a ColorShade ---
function generateStatusShades(appTokens: AppColorTokens): Record<BatchStatusTokenKey, ColorShade> {
    // Mapeamos cada estado a una ColorShade semántica de appTokens
    // Asumimos que AppColorTokens siempre tendrá estas propiedades.
    return {
        pending: appTokens.neutral,     // Gris/Neutral para pendiente
        in_progress: appTokens.primary, // Azul/Principal para en progreso
        ai_prefilled: appTokens.tertiary || appTokens.accent, // Púrpura/Violeta/Acento para prellenado IA
        discrepancies: appTokens.warning,   // Naranja/Amarillo para discrepancias
        completed: appTokens.success,     // Verde para completado
        error: appTokens.danger,        // Rojo para error
        default: appTokens.neutral,     // Gris/Neutral como fallback
    };
}

export function generateBatchTokens(
	appColorTokens: AppColorTokens,
	mode: Mode // Mode ya no se usa directamente aquí si los appTokens ya son específicos del modo
): BatchTokens {
    if (!appColorTokens || !appColorTokens.primary || !appColorTokens.neutral) {
        // ... (tu lógica de fallback para appColorTokens si es incompleto, la mantenemos) ...
        const fallbackPure = '#777777'; const fallbackBg = '#f0f0f0'; const fallbackText = '#333333';
        const fallbackShade = { pure: fallbackPure, pureShade: fallbackPure, text: fallbackText, contrastText: fallbackBg, textShade: fallbackText, bg: fallbackBg, bgShade: fallbackBg, /* bgDark y textDark se infieren o no se usan si appColorTokens ya es mode-specific */ };
        appColorTokens = {
            primary: { ...fallbackShade, pureDark: fallbackPure, textDark: fallbackText, bgDark: fallbackBg },
            secondary: { ...fallbackShade, pureDark: fallbackPure, textDark: fallbackText, bgDark: fallbackBg },
            tertiary: { ...fallbackShade, pureDark: fallbackPure, textDark: fallbackText, bgDark: fallbackBg },
            accent: { ...fallbackShade, pureDark: fallbackPure, textDark: fallbackText, bgDark: fallbackBg },
            success: { ...fallbackShade, pureDark: fallbackPure, textDark: fallbackText, bgDark: fallbackBg },
            warning: { ...fallbackShade, pureDark: fallbackPure, textDark: fallbackText, bgDark: fallbackBg },
            danger: { ...fallbackShade, pureDark: fallbackPure, textDark: fallbackText, bgDark: fallbackBg },
            neutral: { ...fallbackShade, pureDark: fallbackPure, textDark: fallbackText, bgDark: fallbackBg },
            white: { ...fallbackShade, pureDark: fallbackPure, textDark: fallbackText, bgDark: fallbackBg }
        };
    }

	const auxiliaries = generatePastelPalette(appColorTokens.primary.pure, 5);
    auxiliaries.push({
        key: 'auxDefault', solid: appColorTokens.neutral.bgShade || '#e0e0e0',
        gradient: `linear-gradient(135deg, ${appColorTokens.neutral.bgShade || '#e0e0e0'} 0%, ${appColorTokens.neutral.bgShade || '#cccccc'} 100%)`,
        text: appColorTokens.neutral.text || '#555555', border: appColorTokens.neutral.bg || '#cccccc', name: 'Default',
    });
    
    const statusShadesMap = generateStatusShades(appColorTokens);

	return {
		auxiliaries,
        statusShades: statusShadesMap,
		batch: {
			background: appColorTokens.neutral.bg, // Usar el bg del modo actual
		},
        pesoLote: { 
            barBackground: appColorTokens.white.bg, // Blanco para el fondo de la barra
            barFill: appColorTokens.primary.pure, // Usar el color primario para las barritas
            containerBorder: appColorTokens.neutral.bgShade,
        }
	};
}