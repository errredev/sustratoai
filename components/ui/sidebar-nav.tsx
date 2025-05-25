"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/app/theme-provider";
import { useMemo } from "react";
import styles from "./sidebar-nav.module.css";

interface SidebarNavItem {
	title: string;
	href: string;
	icon?: LucideIcon;
	disabled?: boolean;
}

interface SidebarNavProps {
	items: SidebarNavItem[];
	className?: string;
}

export function SidebarNav({ items, className }: SidebarNavProps) {
	const pathname = usePathname() || "";
	const { appColorTokens, mode } = useTheme();

	const isDark = mode === "dark";
	const accentBg = isDark
		? appColorTokens.accent.bgShade
		: appColorTokens.accent.bg;
	const accentBgHover = isDark
		? appColorTokens.accent.bg
		: appColorTokens.accent.bgShade;
	const primaryBg = `${appColorTokens.primary.bg}1A`;
	const primaryBgHover = `${appColorTokens.primary.bg}26`;

	// Crear estilos dinámicos para el hover
	const hoverStyles = useMemo(
		() =>
			({
				"--hover-bg": accentBgHover,
				"--active-bg": primaryBg,
				"--active-hover-bg": primaryBgHover,
			} as React.CSSProperties),
		[accentBgHover, primaryBg, primaryBgHover]
	);

	return (
		<nav className={cn("flex flex-col space-y-1", className)}>
			{items.map((item) => {
				const Icon = item.icon;
				const isActive =
					pathname === item.href ||
					(pathname && pathname.startsWith(`${item.href}/`));

				if (item.disabled) {
					return (
						<div
							key={item.href}
							className="flex items-center px-3 py-2 text-sm font-medium rounded-md opacity-70 cursor-not-allowed transition-colors duration-200"
							style={{
								backgroundColor: accentBg,
							}}>
							{Icon && (
								<Icon
									className="w-5 h-5 mr-2 transition-colors duration-200"
									style={{ color: appColorTokens.neutral.textShade }}
								/>
							)}
							<Text variant="muted">{item.title}</Text>
						</div>
					);
				}

				return (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							"flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
							isActive ? styles["nav-link-active"] : styles["nav-link"]
						)}
						style={hoverStyles}>
						{Icon && (
							<Icon
								className="w-5 h-5 mr-2 transition-colors duration-200"
								style={{
									color: isActive
										? appColorTokens.primary.pure
										: appColorTokens.neutral.text,
								}}
							/>
						)}
						<Text
							variant={isActive ? "subtitle" : "default"}
							color={isActive ? "primary" : "neutral"}
							colorVariant={isActive ? "pure" : "text"}
							className={cn(
								"transition-colors duration-200",
								isActive ? "font-medium" : "font-normal"
							)}>
							{item.title}
						</Text>
					</Link>
				);
			})}
		</nav>
	);
}
