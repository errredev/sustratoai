"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Text } from "@/components/ui/text"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/app/theme-provider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useFontTheme } from "@/app/font-provider"

export default function ShowroomText() {
  const { setColorScheme, setMode, colorScheme, mode, colorTokens } = useTheme()
  const { fontTheme, setFontTheme } = useFontTheme()
  const [mounted, setMounted] = useState(false)

  // Asegurarse de que el componente está montado antes de renderizar
  // para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="container mx-auto py-8 space-y-8">
      <section className="text-center space-y-4">
        <Text variant="heading" size="4xl" gradient="primary">
          Showroom de Texto
        </Text>
        <Text variant="subtitle" className="max-w-2xl mx-auto">
          Guía completa del componente Text con todas sus propiedades y ejemplos de uso
        </Text>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Text variant="title">Configuración del Tema</Text>
            <Text variant="muted">Cambia el esquema de color y el modo para ver cómo se adapta el texto</Text>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center space-x-2">
              <Button
                variant={colorScheme === "blue" ? "default" : "outline"}
                onClick={() => setColorScheme("blue")}
                className="w-24"
              >
                Azul
              </Button>
              <Button
                variant={colorScheme === "green" ? "default" : "outline"}
                onClick={() => setColorScheme("green")}
                className="w-24"
              >
                Verde
              </Button>
              <Button
                variant={colorScheme === "orange" ? "default" : "outline"}
                onClick={() => setColorScheme("orange")}
                className="w-24"
              >
                Naranja
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={mode === "dark"}
                onCheckedChange={(checked) => setMode(checked ? "dark" : "light")}
              />
              <Label htmlFor="dark-mode">Modo Oscuro</Label>
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="variantes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="variantes">Variantes</TabsTrigger>
          <TabsTrigger value="tamaños">Tamaños</TabsTrigger>
          <TabsTrigger value="pesos">Pesos</TabsTrigger>
          <TabsTrigger value="alineacion">Alineación</TabsTrigger>
          <TabsTrigger value="colores">Colores</TabsTrigger>
          <TabsTrigger value="variantes-color">Variantes Color</TabsTrigger>
          <TabsTrigger value="gradientes">Gradientes</TabsTrigger>
          <TabsTrigger value="ejemplos">Ejemplos</TabsTrigger>
        </TabsList>

        {/* VARIANTES */}
        <TabsContent value="variantes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Variantes de Texto</CardTitle>
              <Text variant="subtitle">El componente Text ofrece diferentes variantes para diferentes contextos</Text>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="p-4 border rounded-md">
                    <Text>Default: Texto normal para párrafos y contenido general.</Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="default"
                    </Text>
                  </div>

                  <div className="p-4 border rounded-md">
                    <Text variant="heading">Heading: Para encabezados principales.</Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="heading"
                    </Text>
                  </div>

                  <div className="p-4 border rounded-md">
                    <Text variant="subheading">Subheading: Para encabezados secundarios.</Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="subheading"
                    </Text>
                  </div>

                  <div className="p-4 border rounded-md">
                    <Text variant="title">Title: Para títulos de secciones.</Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="title"
                    </Text>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="p-4 border rounded-md">
                    <Text variant="subtitle">Subtitle: Para subtítulos o descripciones.</Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="subtitle"
                    </Text>
                  </div>

                  <div className="p-4 border rounded-md">
                    <Text variant="label">Label: Para etiquetas de formularios.</Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="label"
                    </Text>
                  </div>

                  <div className="p-4 border rounded-md">
                    <Text variant="caption">Caption: Para textos pequeños explicativos.</Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="caption"
                    </Text>
                  </div>

                  <div className="p-4 border rounded-md">
                    <Text variant="muted">Muted: Para texto secundario menos prominente.</Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="muted"
                    </Text>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                <Text variant="title" className="mb-2">
                  Uso de Variantes
                </Text>
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                  <code>{`<Text>Texto predeterminado</Text>
<Text variant="heading">Encabezado principal</Text>
<Text variant="subheading">Encabezado secundario</Text>
<Text variant="title">Título de sección</Text>
<Text variant="subtitle">Subtítulo descriptivo</Text>
<Text variant="label">Etiqueta de formulario</Text>
<Text variant="caption">Texto pequeño explicativo</Text>
<Text variant="muted">Texto secundario atenuado</Text>`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAMAÑOS */}
        <TabsContent value="tamaños" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tamaños de Texto</CardTitle>
              <Text variant="subtitle">
                El componente Text ofrece diferentes tamaños para adaptarse a diferentes necesidades
              </Text>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <Text size="xs">Tamaño xs: Texto extra pequeño.</Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    size="xs"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text size="sm">Tamaño sm: Texto pequeño.</Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    size="sm"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text size="base">Tamaño base: Texto normal (por defecto).</Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    size="base"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text size="lg">Tamaño lg: Texto grande.</Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    size="lg"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text size="xl">Tamaño xl: Texto extra grande.</Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    size="xl"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text size="2xl">Tamaño 2xl: Texto doble extra grande.</Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    size="2xl"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text size="3xl">Tamaño 3xl: Texto triple extra grande.</Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    size="3xl"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text size="4xl">Tamaño 4xl: Texto cuádruple extra grande.</Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    size="4xl"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text size="5xl">Tamaño 5xl: Texto quíntuple extra grande.</Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    size="5xl"
                  </Text>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                <Text variant="title" className="mb-2">
                  Combinación con Variantes
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Text variant="heading" size="3xl">
                      Encabezado Grande
                    </Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="heading" size="3xl"
                    </Text>
                  </div>
                  <div>
                    <Text variant="title" size="xl">
                      Título Mediano
                    </Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="title" size="xl"
                    </Text>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PESOS */}
        <TabsContent value="pesos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pesos de Texto</CardTitle>
              <Text variant="subtitle">
                El componente Text ofrece diferentes pesos para enfatizar o suavizar el texto
              </Text>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-md">
                  <Text weight="normal" size="xl">
                    Peso normal: Texto con peso normal.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    weight="normal"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text weight="medium" size="xl">
                    Peso medium: Texto con peso medio.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    weight="medium"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text weight="semibold" size="xl">
                    Peso semibold: Texto con peso semi-negrita.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    weight="semibold"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text weight="bold" size="xl">
                    Peso bold: Texto con peso negrita.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    weight="bold"
                  </Text>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                <Text variant="title" className="mb-2">
                  Combinación con Variantes y Tamaños
                </Text>
                <div className="space-y-4">
                  <div>
                    <Text variant="heading" size="2xl" weight="bold">
                      Encabezado en Negrita
                    </Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="heading" size="2xl" weight="bold"
                    </Text>
                  </div>
                  <div>
                    <Text variant="subtitle" size="lg" weight="medium">
                      Subtítulo con Peso Medio
                    </Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="subtitle" size="lg" weight="medium"
                    </Text>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALINEACIÓN */}
        <TabsContent value="alineacion" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alineación de Texto</CardTitle>
              <Text variant="subtitle">El componente Text ofrece diferentes opciones de alineación</Text>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                <div className="border p-4 rounded-md">
                  <Text align="left">
                    Alineación izquierda: Este texto está alineado a la izquierda, que es la alineación por defecto para
                    la mayoría de los textos en interfaces web. Es la opción más legible para textos largos en idiomas
                    que se leen de izquierda a derecha.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    align="left"
                  </Text>
                </div>

                <div className="border p-4 rounded-md">
                  <Text align="center">
                    Alineación centro: Este texto está alineado al centro. Esta alineación es útil para títulos,
                    encabezados o textos cortos que quieres destacar en el centro de la página o componente.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    align="center"
                  </Text>
                </div>

                <div className="border p-4 rounded-md">
                  <Text align="right">
                    Alineación derecha: Este texto está alineado a la derecha. Esta alineación es útil para idiomas que
                    se leen de derecha a izquierda, o para elementos específicos como fechas o números en tablas.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    align="right"
                  </Text>
                </div>

                <div className="border p-4 rounded-md">
                  <Text align="justify">
                    Alineación justificada: Este texto está justificado, lo que significa que se ajusta para que cada
                    línea tenga el mismo ancho, creando márgenes rectos tanto a la izquierda como a la derecha. Esto
                    puede mejorar la apariencia en bloques de texto grandes, pero puede crear espacios irregulares entre
                    palabras. Es común en periódicos, revistas y libros impresos.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    align="justify"
                  </Text>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                <Text variant="title" className="mb-2">
                  Combinación con Otras Propiedades
                </Text>
                <div className="space-y-4">
                  <div>
                    <Text variant="heading" size="2xl" align="center">
                      Encabezado Centrado
                    </Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="heading" size="2xl" align="center"
                    </Text>
                  </div>
                  <div>
                    <Text variant="subtitle" align="right">
                      Subtítulo Alineado a la Derecha
                    </Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      variant="subtitle" align="right"
                    </Text>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COLORES */}
        <TabsContent value="colores" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Colores de Texto</CardTitle>
              <Text variant="subtitle">El componente Text ofrece diferentes opciones de color</Text>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <Text color="default" size="xl">
                    Color Default: Color de texto predeterminado.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    color="default"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text color="primary" size="xl">
                    Color Primary: Color primario del tema actual.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    color="primary"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text color="secondary" size="xl">
                    Color Secondary: Color secundario del tema actual.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    color="secondary"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text color="tertiary" size="xl">
                    Color Tertiary: Color terciario del tema actual.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    color="tertiary"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text color="accent" size="xl">
                    Color Accent: Color de acento universal.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    color="accent"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text color="success" size="xl">
                    Color Success: Color de éxito universal.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    color="success"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text color="warning" size="xl">
                    Color Warning: Color de advertencia universal.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    color="warning"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text color="danger" size="xl">
                    Color Danger: Color de peligro universal.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    color="danger"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text color="muted" size="xl">
                    Color Muted: Color atenuado para texto secundario.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    color="muted"
                  </Text>
                </div>

                <div className="p-4 border rounded-md">
                  <Text color="neutral" size="xl">
                    Color Neutral: Color neutro independiente del tema.
                  </Text>
                  <Text variant="caption" className="mt-1 text-gray-500">
                    color="neutral"
                  </Text>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                <Text variant="title" className="mb-2">
                  Adaptación al Modo Oscuro
                </Text>
                <Text className="mb-4">
                  Los colores se adaptan automáticamente al modo oscuro para mantener el contraste y la legibilidad.
                  Prueba a cambiar entre modo claro y oscuro para ver cómo cambian los colores.
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Text color="primary" size="xl" weight="bold">
                      Texto en Color Primario
                    </Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      color="primary" size="xl" weight="bold"
                    </Text>
                  </div>
                  <div>
                    <Text color="danger" size="xl" weight="bold">
                      Texto en Color de Peligro
                    </Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      color="danger" size="xl" weight="bold"
                    </Text>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VARIANTES DE COLOR */}
        <TabsContent value="variantes-color" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Variantes de Color</CardTitle>
              <Text variant="subtitle">
                El componente Text ofrece tres variantes de color para cada color: pure, text y dark
              </Text>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                <Text variant="title" className="mb-2">
                  Variantes de Color Primary
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-md">
                    <Text color="primary" colorVariant="pure" size="xl" weight="bold">
                      Primary Pure
                    </Text>
                    <Text variant="caption" className="mt-1">
                      color="primary" colorVariant="pure"
                    </Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      {colorScheme}.primary.pure (en modo claro) o {colorScheme}.primary.pureDark (en modo oscuro)
                    </Text>
                  </div>

                  <div className="p-4 border rounded-md">
                    <Text color="primary" colorVariant="text" size="xl" weight="bold">
                      Primary Text
                    </Text>
                    <Text variant="caption" className="mt-1">
                      color="primary" colorVariant="text"
                    </Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      {colorScheme}.primary.text (en modo claro) o {colorScheme}.primary.textDark (en modo oscuro)
                    </Text>
                  </div>

                  <div className="p-4 border rounded-md">
                    <Text color="primary" colorVariant="dark" size="xl" weight="bold">
                      Primary Dark
                    </Text>
                    <Text variant="caption" className="mt-1">
                      color="primary" colorVariant="dark"
                    </Text>
                    <Text variant="caption" className="mt-1 text-gray-500">
                      {colorScheme}.primary.textDark (siempre)
                    </Text>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Text variant="title" className="mb-2">
                  Variantes de Color Secondary
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-md">
                    <Text color="secondary" colorVariant="pure" size="xl" weight="bold">
                      Secondary Pure
                    </Text>
                    <Text variant="caption" className="mt-1">
                      color="secondary" colorVariant="pure"
                    </Text>
                  </div>

                  <div className="p-4 border rounded-md">
                    <Text color="secondary" colorVariant="text" size="xl" weight="bold">
                      Secondary Text
                    </Text>
                    <Text variant="caption" className="mt-1">
                      color="secondary" colorVariant="text"
                    </Text>
                  </div>

                  <div className="p-4 border rounded-md">
                    <Text color="secondary" colorVariant="dark" size="xl" weight="bold">
                      Secondary Dark
                    </Text>
                    <Text variant="caption" className="mt-1">
                      color="secondary" colorVariant="dark"
                    </Text>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Text variant="title" className="mb-2">
                  Variantes de Color Tertiary
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-md">
                    <Text color="tertiary" colorVariant="pure" size="xl" weight="bold">
                      Tertiary Pure
                    </Text>
                    <Text variant="caption" className="mt-1">
                      color="tertiary" colorVariant="pure"
                    </Text>
                  </div>

                  <div className="p-4 border rounded-md">
                    <Text color="tertiary" colorVariant="text" size="xl" weight="bold">
                      Tertiary Text
                    </Text>
                    <Text variant="caption" className="mt-1">
                      color="tertiary" colorVariant="text"
                    </Text>
                  </div>

                  <div className="p-4 border rounded-md">
                    <Text color="tertiary" colorVariant="dark" size="xl" weight="bold">
                      Tertiary Dark
                    </Text>
                    <Text variant="caption" className="mt-1">
                      color="tertiary" colorVariant="dark"
                    </Text>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Text variant="title" className="mb-2">
                  Variantes de Colores Semánticos
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <div className="space-y-2">
                      <Text color="accent" colorVariant="pure" size="lg" weight="bold">
                        Accent Pure
                      </Text>
                      <Text color="accent" colorVariant="text" size="lg" weight="medium">
                        Accent Text
                      </Text>
                      <Text color="accent" colorVariant="dark" size="lg">
                        Accent Dark
                      </Text>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="space-y-2">
                      <Text color="success" colorVariant="pure" size="lg" weight="bold">
                        Success Pure
                      </Text>
                      <Text color="success" colorVariant="text" size="lg" weight="medium">
                        Success Text
                      </Text>
                      <Text color="success" colorVariant="dark" size="lg">
                        Success Dark
                      </Text>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="space-y-2">
                      <Text color="warning" colorVariant="pure" size="lg" weight="bold">
                        Warning Pure
                      </Text>
                      <Text color="warning" colorVariant="text" size="lg" weight="medium">
                        Warning Text
                      </Text>
                      <Text color="warning" colorVariant="dark" size="lg">
                        Warning Dark
                      </Text>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="space-y-2">
                      <Text color="danger" colorVariant="pure" size="lg" weight="bold">
                        Danger Pure
                      </Text>
                      <Text color="danger" colorVariant="text" size="lg" weight="medium">
                        Danger Text
                      </Text>
                      <Text color="danger" colorVariant="dark" size="lg">
                        Danger Dark
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GRADIENTES */}
        <TabsContent value="gradientes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gradientes de Texto</CardTitle>
              <Text variant="subtitle">
                Texto con efecto de gradiente triple (pureDark → text → textDark) que se adapta al tema activo
              </Text>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="p-4 border rounded-md">
                <Text variant="title" className="mb-4">
                  Gradientes del Tema Actual
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Text size="3xl" gradient="primary">
                        Gradiente Primary
                      </Text>
                      <Text variant="caption" className="mt-1">
                        gradient="primary"
                      </Text>
                    </div>

                    <div>
                      <Text size="3xl" gradient="secondary">
                        Gradiente Secondary
                      </Text>
                      <Text variant="caption" className="mt-1">
                        gradient="secondary"
                      </Text>
                    </div>

                    <div>
                      <Text size="3xl" gradient="tertiary">
                        Gradiente Tertiary
                      </Text>
                      <Text variant="caption" className="mt-1">
                        gradient="tertiary"
                      </Text>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Text size="3xl" gradient="accent">
                        Gradiente Accent
                      </Text>
                      <Text variant="caption" className="mt-1">
                        gradient="accent"
                      </Text>
                    </div>

                    <div>
                      <Text size="3xl" gradient="success">
                        Gradiente Success
                      </Text>
                      <Text variant="caption" className="mt-1">
                        gradient="success"
                      </Text>
                    </div>

                    <div>
                      <Text size="3xl" gradient="warning">
                        Gradiente Warning
                      </Text>
                      <Text variant="caption" className="mt-1">
                        gradient="warning"
                      </Text>
                    </div>

                    <div>
                      <Text size="3xl" gradient="danger">
                        Gradiente Danger
                      </Text>
                      <Text variant="caption" className="mt-1">
                        gradient="danger"
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                <Text variant="title" className="mb-4">
                  Combinaciones con Otras Propiedades
                </Text>
                <div className="space-y-6">
                  <div>
                    <Text variant="heading" size="4xl" gradient="primary">
                      Título Principal con Gradiente
                    </Text>
                    <Text variant="caption" className="mt-1">
                      variant="heading" size="4xl" gradient="primary"
                    </Text>
                  </div>

                  <div>
                    <Text variant="title" size="2xl" gradient="secondary" align="center">
                      Título Centrado con Gradiente
                    </Text>
                    <Text variant="caption" className="mt-1 text-center">
                      variant="title" size="2xl" gradient="secondary" align="center"
                    </Text>
                  </div>

                  <div>
                    <Text size="xl" gradient="tertiary" weight="bold">
                      Texto en Negrita con Gradiente
                    </Text>
                    <Text variant="caption" className="mt-1">
                      size="xl" gradient="tertiary" weight="bold"
                    </Text>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <Text variant="title" className="mb-4">
                  Uso del Gradiente Booleano
                </Text>
                <div className="space-y-4">
                  <div>
                    <Text size="3xl" gradient={true}>
                      Gradiente Predeterminado (Primary)
                    </Text>
                    <Text variant="caption" className="mt-1">
                      gradient={"{true}"} (equivalente a gradient="primary")
                    </Text>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EJEMPLOS */}
        <TabsContent value="ejemplos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ejemplos Prácticos</CardTitle>
              <Text variant="subtitle">Ejemplos de uso del componente Text en situaciones reales</Text>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="p-6 border rounded-md bg-white dark:bg-gray-800">
                <Text variant="title" className="mb-6">
                  Ejemplo de Encabezado de Página
                </Text>
                <div className="flex flex-col items-center text-center">
                  <Text color="primary" colorVariant="pure" weight="bold" size="xl" align="center">
                    UNIVERSIDAD CATÓLICA DE CHILE
                  </Text>
                  <div className="h-1 w-24 bg-blue-600 my-3"></div>
                  <Text variant="title" gradient="primary" size="4xl" align="center" className="my-4">
                    Ayudas Técnicas
                  </Text>
                  <Text variant="title" gradient="secondary" size="2xl" align="center" className="mb-6">
                    Escuela de Trabajo Social
                  </Text>
                  <Text variant="subtitle" color="muted" align="center" className="max-w-2xl">
                    Plataforma de herramientas para investigación y análisis de datos cualitativos
                  </Text>
                </div>
              </div>

              <div className="p-6 border rounded-md bg-white dark:bg-gray-800">
                <Text variant="title" className="mb-6">
                  Ejemplo de Artículo
                </Text>
                <div className="max-w-3xl mx-auto">
                  <Text variant="heading" size="3xl" className="mb-4">
                    La Importancia del Análisis Cualitativo
                  </Text>
                  <Text variant="subtitle" color="muted" className="mb-6">
                    Publicado el 30 de abril de 2025 · 5 min de lectura
                  </Text>
                  <Text className="mb-4">
                    El análisis cualitativo es fundamental para comprender en profundidad los fenómenos sociales. A
                    diferencia del análisis cuantitativo, que se centra en datos numéricos, el análisis cualitativo
                    busca entender significados, experiencias y contextos.
                  </Text>
                  <Text variant="subheading" size="xl" className="mt-6 mb-3">
                    Métodos de Análisis Cualitativo
                  </Text>
                  <Text className="mb-4">
                    Existen diversos métodos para realizar análisis cualitativo, cada uno con sus propias fortalezas y
                    aplicaciones específicas. Entre los más utilizados encontramos:
                  </Text>
                  <div className="ml-6 mb-6">
                    <Text variant="title" size="lg" className="mb-2">
                      1. Análisis de Contenido
                    </Text>
                    <Text className="mb-4">
                      Técnica que permite examinar sistemáticamente textos y documentos para identificar temas, patrones
                      y significados.
                    </Text>
                    <Text variant="title" size="lg" className="mb-2">
                      2. Análisis del Discurso
                    </Text>
                    <Text>
                      Método que estudia cómo el lenguaje construye y refleja realidades sociales, relaciones de poder e
                      identidades.
                    </Text>
                  </div>
                  <Text color="primary" weight="medium" className="mt-6">
                    El análisis cualitativo nos permite dar voz a las experiencias humanas que no pueden ser reducidas a
                    números.
                  </Text>
                </div>
              </div>

              <div className="p-6 border rounded-md bg-white dark:bg-gray-800">
                <Text variant="title" className="mb-6">
                  Ejemplo de Tarjeta de Producto
                </Text>
                <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md">
                  <div className="p-6">
                    <Text variant="title" size="xl" className="mb-2">
                      Software de Análisis Cualitativo
                    </Text>
                    <Text variant="subtitle" color="muted" className="mb-4">
                      Herramienta profesional para investigadores
                    </Text>
                    <Text className="mb-6">
                      Plataforma completa para codificación, análisis y visualización de datos cualitativos. Ideal para
                      investigadores, académicos y estudiantes.
                    </Text>
                    <div className="flex justify-between items-center">
                      <Text variant="heading" size="2xl" color="primary">
                        $299
                      </Text>
                      <Text variant="caption" color="success">
                        En stock · Envío inmediato
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border rounded-md bg-white dark:bg-gray-800">
                <Text variant="title" className="mb-6">
                  Ejemplo de Mensaje de Estado
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <Text variant="title" size="lg" color="success" className="mb-2">
                      Operación Exitosa
                    </Text>
                    <Text color="success" colorVariant="dark">
                      Los datos han sido guardados correctamente en la base de datos. Puedes continuar con el siguiente
                      paso.
                    </Text>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <Text variant="title" size="lg" color="danger" className="mb-2">
                      Error en la Operación
                    </Text>
                    <Text color="danger" colorVariant="dark">
                      No se pudieron guardar los cambios debido a un problema de conexión. Por favor, intenta
                      nuevamente.
                    </Text>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                <Text variant="title" className="mb-4">
                  Código de Ejemplo
                </Text>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                  <code>{`// Ejemplo de uso del componente Text en una página de perfil
export default function ProfilePage() {
  return (
    <div className="container mx-auto p-6">
      <Text variant="heading" size="3xl" gradient="primary">
        Perfil de Usuario
      </Text>
      
      <div className="mt-6">
        <Text variant="title" size="xl">
          Información Personal
        </Text>
        <Text variant="subtitle" color="muted" className="mt-1 mb-4">
          Datos básicos de tu cuenta
        </Text>
        
        <div className="space-y-2">
          <div>
            <Text variant="label">Nombre</Text>
            <Text>María González</Text>
          </div>
          
          <div>
            <Text variant="label">Correo Electrónico</Text>
            <Text>maria.gonzalez@ejemplo.com</Text>
          </div>
          
          <div>
            <Text variant="label">Rol</Text>
            <Text color="primary" weight="medium">Investigador Principal</Text>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Text variant="caption" align="center" className="text-gray-500">
          Última actualización: 30 de abril de 2025
        </Text>
      </div>
    </div>
  )
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tabla de Referencia Rápida</CardTitle>
          <Text variant="subtitle">Resumen de todas las propiedades disponibles para el componente Text</Text>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Propiedad</th>
                  <th className="py-2 px-4 text-left">Valores</th>
                  <th className="py-2 px-4 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">variant</td>
                  <td className="py-2 px-4">default, heading, subheading, title, subtitle, label, caption, muted</td>
                  <td className="py-2 px-4">Define el estilo general del texto</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">size</td>
                  <td className="py-2 px-4">xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl</td>
                  <td className="py-2 px-4">Define el tamaño del texto</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">weight</td>
                  <td className="py-2 px-4">normal, medium, semibold, bold</td>
                  <td className="py-2 px-4">Define el peso (grosor) del texto</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">align</td>
                  <td className="py-2 px-4">left, center, right, justify</td>
                  <td className="py-2 px-4">Define la alineación del texto</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">color</td>
                  <td className="py-2 px-4">
                    default, primary, secondary, tertiary, accent, success, warning, danger, muted, neutral
                  </td>
                  <td className="py-2 px-4">Define el color del texto</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">colorVariant</td>
                  <td className="py-2 px-4">pure, text, dark</td>
                  <td className="py-2 px-4">Define la variante del color (pure, text o dark)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">gradient</td>
                  <td className="py-2 px-4">primary, secondary, tertiary, accent, success, warning, danger, boolean</td>
                  <td className="py-2 px-4">Aplica un efecto de gradiente triple al texto</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">fontType</td>
                  <td className="py-2 px-4">heading, body</td>
                  <td className="py-2 px-4">Especifica qué tipo de fuente usar del par de fuentes actual</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium">className</td>
                  <td className="py-2 px-4">string</td>
                  <td className="py-2 px-4">Clases CSS adicionales para personalización</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
