import {
  Home,
  Bell,
  Settings,
  User,
  Mail,
  Calendar,
  Search,
  Heart,
  Star,
  Zap,
  Shield,
  Award,
} from "@/components/ui/lucide-icons";
import { Icon } from "@/components/ui/icon";

export default function IconShowroom() {
  // Lista de colores disponibles
  const colors: Array<{ name: string; value: any }> = [
    { name: "default", value: "default" },
    { name: "primary", value: "primary" },
    { name: "secondary", value: "secondary" },
    { name: "tertiary", value: "tertiary" },
    { name: "accent", value: "accent" },
    { name: "muted", value: "muted" },
    { name: "success", value: "success" },
    { name: "warning", value: "warning" },
    { name: "danger", value: "danger" },
    { name: "neutral", value: "neutral" },
  ];

  // Lista de variantes de color
  const colorVariants = [
    { name: "Pure", value: "pure" },
    { name: "Text", value: "text" },
    { name: "Dark", value: "dark" },
  ];

  // Lista de tamaños disponibles
  const sizes: Array<{ name: string; value: any }> = [
    { name: "xs", value: "xs" },
    { name: "sm", value: "sm" },
    { name: "md", value: "md" },
    { name: "lg", value: "lg" },
    { name: "xl", value: "xl" },
    { name: "2xl", value: "2xl" },
  ];

  // Lista de iconos para mostrar
  const icons = [
    { name: "Home", Component: Home },
    { name: "Bell", Component: Bell },
    { name: "Settings", Component: Settings },
    { name: "User", Component: User },
    { name: "Mail", Component: Mail },
    { name: "Calendar", Component: Calendar },
    { name: "Search", Component: Search },
    { name: "Heart", Component: Heart },
    { name: "Star", Component: Star },
    { name: "Zap", Component: Zap },
    { name: "Shield", Component: Shield },
    { name: "Award", Component: Award },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Sistema de Iconos</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Todas las Variantes de Color
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {colorVariants.map((variant) => (
            <div key={variant.name} className="p-6 border rounded-lg">
              <h3 className="text-xl font-medium mb-4">
                Variante: {variant.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colors.map((color) => (
                  <div key={color.name} className="p-4 border rounded-lg">
                    <h4 className="text-lg font-medium mb-3 capitalize">
                      {color.name}
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {icons.slice(0, 6).map(({ name, Component }) => (
                        <div key={name} className="flex flex-col items-center">
                          <Component
                            color={color.value}
                            colorVariant={
                              variant.value as "pure" | "text" | "dark"
                            }
                            size="md"
                          />
                          <span className="text-xs mt-1">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Iconos con Gradiente</h2>
        <div className="grid grid-cols-1 gap-6">
          {/* Gradiente con contorno inverso (ahora es el predeterminado) */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-medium mb-4">
              Gradiente con Contorno Inverso (Predeterminado)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Esta técnica aplica un gradiente al relleno y un gradiente inverso
              al contorno, creando un efecto visual que resalta las formas
              internas. Este es ahora el comportamiento predeterminado para
              iconos con gradiente.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colors
                .filter((c) => c.name !== "accent")
                .slice(0, 6)
                .map((color) => (
                  <div key={color.name} className="p-4 border rounded-lg">
                    <h4 className="text-lg font-medium mb-3 capitalize">
                      {color.name} + Accent
                    </h4>
                    <div className="flex flex-wrap gap-6">
                      {icons.slice(0, 4).map(({ name, Component }) => (
                        <div key={name} className="flex flex-col items-center">
                          <Component
                            color={color.value}
                            size="xl"
                            gradient={true}
                            gradientWith="accent"
                          />
                          <span className="text-xs mt-1">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Gradiente clásico (ahora es opcional) */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-medium mb-4">
              Gradiente Clásico (Opcional)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              El estilo clásico con el mismo gradiente tanto para el relleno
              como para el contorno. Para usar este estilo, especifica{" "}
              <code>inverseStroke=false</code>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colors
                .filter((c) => c.name !== "accent")
                .slice(0, 6)
                .map((color) => (
                  <div key={color.name} className="p-4 border rounded-lg">
                    <h4 className="text-lg font-medium mb-3 capitalize">
                      {color.name} + Accent
                    </h4>
                    <div className="flex flex-wrap gap-6">
                      {icons.slice(0, 4).map(({ name, Component }) => (
                        <div key={name} className="flex flex-col items-center">
                          <Component
                            color={color.value}
                            size="xl"
                            gradient={true}
                            gradientWith="accent"
                            inverseStroke={false}
                          />
                          <span className="text-xs mt-1">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Gradiente solo en el borde */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-medium mb-4">
              Gradiente Solo en Borde
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colors
                .filter((c) => c.name !== "accent")
                .slice(0, 6)
                .map((color) => (
                  <div key={color.name} className="p-4 border rounded-lg">
                    <h4 className="text-lg font-medium mb-3 capitalize">
                      {color.name} + Accent
                    </h4>
                    <div className="flex flex-wrap gap-6">
                      {icons.slice(0, 4).map(({ name, Component }) => (
                        <div key={name} className="flex flex-col items-center">
                          <Component
                            color={color.value}
                            size="lg"
                            gradient={true}
                            gradientWith="accent"
                            strokeOnly={true}
                          />
                          <span className="text-xs mt-1">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Tamaños de Iconos</h2>
        <div className="p-4 border rounded-lg">
          <div className="flex flex-wrap items-end gap-8">
            {sizes.map((size) => (
              <div key={size.name} className="flex flex-col items-center">
                <Home color="primary" size={size.value} />
                <span className="text-xs mt-2">{size.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
