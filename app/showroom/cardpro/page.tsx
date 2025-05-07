"use client";

import { useState } from "react";
import { ProCard } from "@/components/ui/pro-card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ImageIcon,
  Package,
  AlertTriangle,
  TrendingUp,
  User,
} from "lucide-react";

export default function ShowroomCardPro() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    setSelectedCard(selectedCard === id ? null : id);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <Text variant="heading" size="3xl" gradient="primary" className="mb-2">
          ProCard Showroom
        </Text>
        <Text
          variant="default"
          size="lg"
          color="neutral"
          colorVariant="muted"
          className="max-w-2xl mx-auto"
        >
          Referencia completa del componente ProCard con todos sus
          subcomponentes y variantes
        </Text>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="sections">Secciones</TabsTrigger>
          <TabsTrigger value="variants">Variantes</TabsTrigger>
          <TabsTrigger value="states">Estados</TabsTrigger>
          <TabsTrigger value="examples">Ejemplos</TabsTrigger>
        </TabsList>

        {/* Sección Básica */}
        <TabsContent value="basic" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Text variant="heading" size="xl" className="mb-4">
                ProCard Básico
              </Text>
              <ProCard>
                <Text variant="default">
                  Contenido básico de la tarjeta sin usar subcomponentes
                </Text>
              </ProCard>
            </div>

            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Con borde
              </Text>
              <ProCard border="normal">
                <Text variant="default">Tarjeta con borde normal</Text>
              </ProCard>
            </div>

            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Borde superior
              </Text>
              <ProCard variant="primary" border="top">
                <ProCard.Header>
                  <ProCard.Title>Título de la tarjeta</ProCard.Title>
                  <ProCard.Subtitle>
                    Subtítulo descriptivo de la tarjeta
                  </ProCard.Subtitle>
                </ProCard.Header>

                <ProCard.Media>
                  <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                    <Icon
                      icon={ImageIcon}
                      size="xl"
                      className="text-blue-500 dark:text-blue-300"
                    />
                  </div>
                </ProCard.Media>

                <ProCard.Content>
                  <Text>
                    Este es el contenido principal de la tarjeta. Aquí puedes
                    incluir cualquier tipo de información relevante para el
                    usuario. El contenido puede ser tan extenso como sea
                    necesario.
                  </Text>
                </ProCard.Content>

                <ProCard.Actions>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Aceptar</Button>
                </ProCard.Actions>

                <ProCard.Footer>
                  <Text
                    variant="default"
                    size="xs"
                    color="neutral"
                    colorVariant="muted"
                  >
                    Última actualización: Mayo 2023
                  </Text>
                </ProCard.Footer>
              </ProCard>
            </div>

            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Borde izquierdo
              </Text>
              <ProCard border="left">
                <Text variant="default">Tarjeta con borde izquierdo</Text>
              </ProCard>
            </div>
          </div>
        </TabsContent>

        {/* Secciones */}
        <TabsContent value="sections" className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Todas las secciones
              </Text>
              <ProCard>
                <ProCard.Header>
                  <ProCard.Title>Título de la tarjeta</ProCard.Title>
                  <ProCard.Subtitle>
                    Subtítulo descriptivo de la tarjeta
                  </ProCard.Subtitle>
                </ProCard.Header>

                <ProCard.Media>
                  <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                    <Icon
                      icon={ImageIcon}
                      size="xl"
                      className="text-blue-500 dark:text-blue-300"
                    />
                  </div>
                </ProCard.Media>

                <ProCard.Content>
                  <Text>
                    Este es el contenido principal de la tarjeta. Aquí puedes
                    incluir cualquier tipo de información relevante para el
                    usuario. El contenido puede ser tan extenso como sea
                    necesario.
                  </Text>
                </ProCard.Content>

                <ProCard.Actions>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Aceptar</Button>
                </ProCard.Actions>

                <ProCard.Footer>
                  <Text
                    variant="default"
                    size="xs"
                    color="neutral"
                    colorVariant="muted"
                  >
                    Última actualización: Mayo 2023
                  </Text>
                </ProCard.Footer>
              </ProCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Text variant="heading" size="xl" className="mb-4">
                  Solo Header
                </Text>
                <ProCard>
                  <ProCard.Header>
                    <ProCard.Title>Título de la tarjeta</ProCard.Title>
                    <ProCard.Subtitle>Subtítulo descriptivo</ProCard.Subtitle>
                  </ProCard.Header>
                  <Text className="mt-4">Contenido adicional...</Text>
                </ProCard>
              </div>

              <div>
                <Text variant="heading" size="xl" className="mb-4">
                  Solo Content
                </Text>
                <ProCard>
                  <ProCard.Content>
                    <Text>
                      Este es el contenido principal de la tarjeta. El
                      componente Content proporciona los márgenes y espaciado
                      adecuados.
                    </Text>
                  </ProCard.Content>
                </ProCard>
              </div>

              <div>
                <Text variant="heading" size="xl" className="mb-4">
                  Media + Content
                </Text>
                <ProCard>
                  <ProCard.Media>
                    <div className="h-32 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex items-center justify-center">
                      <Icon
                        icon={ImageIcon}
                        size="xl"
                        className="text-green-500 dark:text-green-300"
                      />
                    </div>
                  </ProCard.Media>
                  <ProCard.Content>
                    <Text>Contenido que sigue a un elemento multimedia</Text>
                  </ProCard.Content>
                </ProCard>
              </div>

              <div>
                <Text variant="heading" size="xl" className="mb-4">
                  Content + Actions
                </Text>
                <ProCard>
                  <ProCard.Content>
                    <Text>Contenido con botones de acción al final</Text>
                  </ProCard.Content>
                  <ProCard.Actions>
                    <Button>Acción principal</Button>
                  </ProCard.Actions>
                </ProCard>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Variantes */}
        <TabsContent value="variants" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Primary
              </Text>
              <ProCard variant="primary">
                <ProCard.Header>
                  <ProCard.Title>Variante Primary</ProCard.Title>
                </ProCard.Header>
                <ProCard.Content>
                  <Text>Contenido de la tarjeta con variante primary</Text>
                </ProCard.Content>
              </ProCard>
            </div>

            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Secondary
              </Text>
              <ProCard variant="secondary">
                <ProCard.Header>
                  <ProCard.Title>Variante Secondary</ProCard.Title>
                </ProCard.Header>
                <ProCard.Content>
                  <Text>Contenido de la tarjeta con variante secondary</Text>
                </ProCard.Content>
              </ProCard>
            </div>

            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Tertiary
              </Text>
              <ProCard variant="tertiary">
                <ProCard.Header>
                  <ProCard.Title>Variante Tertiary</ProCard.Title>
                </ProCard.Header>
                <ProCard.Content>
                  <Text>Contenido de la tarjeta con variante tertiary</Text>
                </ProCard.Content>
              </ProCard>
            </div>

            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Success
              </Text>
              <ProCard variant="success">
                <ProCard.Header>
                  <ProCard.Title>Variante Success</ProCard.Title>
                </ProCard.Header>
                <ProCard.Content>
                  <Text>Contenido de la tarjeta con variante success</Text>
                </ProCard.Content>
              </ProCard>
            </div>

            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Warning
              </Text>
              <ProCard variant="warning">
                <ProCard.Header>
                  <ProCard.Title>Variante Warning</ProCard.Title>
                </ProCard.Header>
                <ProCard.Content>
                  <Text>Contenido de la tarjeta con variante warning</Text>
                </ProCard.Content>
              </ProCard>
            </div>

            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Error
              </Text>
              <ProCard variant="error">
                <ProCard.Header>
                  <ProCard.Title>Variante Error</ProCard.Title>
                </ProCard.Header>
                <ProCard.Content>
                  <Text>Contenido de la tarjeta con variante error</Text>
                </ProCard.Content>
              </ProCard>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Borde con variante diferente
              </Text>
              <ProCard variant="primary" border="top" borderVariant="secondary">
                <ProCard.Header>
                  <ProCard.Title>Borde personalizado</ProCard.Title>
                </ProCard.Header>
                <ProCard.Content>
                  <Text>
                    Esta tarjeta tiene una variante primary pero el borde
                    superior usa la variante secondary
                  </Text>
                </ProCard.Content>
              </ProCard>
            </div>

            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Borde izquierdo con variante
              </Text>
              <ProCard variant="neutral" border="left" borderVariant="error">
                <ProCard.Header>
                  <ProCard.Title>Borde izquierdo de error</ProCard.Title>
                </ProCard.Header>
                <ProCard.Content>
                  <Text>
                    Esta tarjeta tiene una variante neutral pero el borde
                    izquierdo usa la variante error
                  </Text>
                </ProCard.Content>
              </ProCard>
            </div>
          </div>
        </TabsContent>

        {/* Estados */}
        <TabsContent value="states" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Estado seleccionado
              </Text>
              <div className="space-y-4">
                <ProCard
                  selected={selectedCard === "card1"}
                  onClick={() => handleCardClick("card1")}
                  className="cursor-pointer"
                >
                  <ProCard.Header>
                    <ProCard.Title>Tarjeta seleccionable</ProCard.Title>
                  </ProCard.Header>
                  <ProCard.Content>
                    <Text>Haz clic en esta tarjeta para seleccionarla</Text>
                  </ProCard.Content>
                </ProCard>

                <ProCard
                  selected={selectedCard === "card2"}
                  onClick={() => handleCardClick("card2")}
                  className="cursor-pointer"
                >
                  <ProCard.Header>
                    <ProCard.Title>Otra tarjeta seleccionable</ProCard.Title>
                  </ProCard.Header>
                  <ProCard.Content>
                    <Text>
                      Solo una tarjeta puede estar seleccionada a la vez
                    </Text>
                  </ProCard.Content>
                </ProCard>
              </div>
            </div>

            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Estado de carga
              </Text>
              <ProCard loading>
                <ProCard.Header>
                  <ProCard.Title>Tarjeta en carga</ProCard.Title>
                </ProCard.Header>
                <ProCard.Content>
                  <Text>Este contenido no se muestra durante la carga</Text>
                </ProCard.Content>
              </ProCard>
            </div>
          </div>
        </TabsContent>

        {/* Ejemplos */}
        <TabsContent value="examples" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Tarjeta de producto
              </Text>
              <ProCard border="normal">
                <ProCard.Media>
                  <div className="h-48 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                    <Icon
                      icon={Package}
                      size="xl"
                      className="text-blue-500 dark:text-blue-300"
                    />
                  </div>
                </ProCard.Media>
                <ProCard.Header>
                  <ProCard.Title>Producto Premium</ProCard.Title>
                  <ProCard.Subtitle>$99.99 - Disponible</ProCard.Subtitle>
                </ProCard.Header>
                <ProCard.Content>
                  <Text className="mb-2">
                    Este producto premium ofrece características avanzadas y
                    alta calidad para satisfacer tus necesidades.
                  </Text>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                    <Text variant="default" size="sm" className="ml-2">
                      (128 reseñas)
                    </Text>
                  </div>
                </ProCard.Content>
                <ProCard.Actions>
                  <Button variant="outline">Añadir al carrito</Button>
                  <Button>Comprar ahora</Button>
                </ProCard.Actions>
              </ProCard>
            </div>

            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Tarjeta de notificación
              </Text>
              <ProCard variant="warning" border="left">
                <ProCard.Header>
                  <div className="flex items-center">
                    <Icon
                      icon={AlertTriangle}
                      className="mr-2 text-yellow-500"
                    />
                    <ProCard.Title>Actualización pendiente</ProCard.Title>
                  </div>
                </ProCard.Header>
                <ProCard.Content>
                  <Text>
                    Hay una actualización importante pendiente para tu sistema.
                    Recomendamos instalarla lo antes posible para mantener la
                    seguridad y rendimiento.
                  </Text>
                </ProCard.Content>
                <ProCard.Actions>
                  <Button variant="outline">Más tarde</Button>
                  <Button variant="default">Actualizar ahora</Button>
                </ProCard.Actions>
              </ProCard>
            </div>

            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Tarjeta de estadísticas
              </Text>
              <ProCard variant="primary" className="overflow-hidden">
                <ProCard.Header>
                  <ProCard.Title>Rendimiento mensual</ProCard.Title>
                </ProCard.Header>
                <ProCard.Content>
                  <div className="flex justify-between items-center mb-4">
                    <Text variant="heading" size="4xl" className="font-bold">
                      87%
                    </Text>
                    <Icon
                      icon={TrendingUp}
                      size="xl"
                      className="text-green-500"
                    />
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-4">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "87%" }}
                    ></div>
                  </div>
                  <Text
                    variant="default"
                    size="sm"
                    color="neutral"
                    colorVariant="muted"
                  >
                    Incremento del 12% respecto al mes anterior
                  </Text>
                </ProCard.Content>
                <ProCard.Footer>
                  <Text
                    variant="default"
                    size="xs"
                    color="neutral"
                    colorVariant="muted"
                  >
                    Actualizado hace 2 horas
                  </Text>
                </ProCard.Footer>
              </ProCard>
            </div>

            <div>
              <Text variant="heading" size="xl" className="mb-4">
                Tarjeta de perfil
              </Text>
              <ProCard border="normal">
                <div className="flex justify-center -mt-4 mb-2">
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center border-4 border-white dark:border-gray-800">
                    <Icon
                      icon={User}
                      size="xl"
                      className="text-blue-500 dark:text-blue-300"
                    />
                  </div>
                </div>
                <ProCard.Header className="text-center">
                  <ProCard.Title>Ana Martínez</ProCard.Title>
                  <ProCard.Subtitle>Investigadora Principal</ProCard.Subtitle>
                </ProCard.Header>
                <ProCard.Content>
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="text-center">
                      <Text variant="heading" size="lg">
                        24
                      </Text>
                      <Text
                        variant="default"
                        size="sm"
                        color="neutral"
                        colorVariant="muted"
                      >
                        Proyectos
                      </Text>
                    </div>
                    <div className="text-center">
                      <Text variant="heading" size="lg">
                        142
                      </Text>
                      <Text
                        variant="default"
                        size="sm"
                        color="neutral"
                        colorVariant="muted"
                      >
                        Entrevistas
                      </Text>
                    </div>
                    <div className="text-center">
                      <Text variant="heading" size="lg">
                        8
                      </Text>
                      <Text
                        variant="default"
                        size="sm"
                        color="neutral"
                        colorVariant="muted"
                      >
                        Publicaciones
                      </Text>
                    </div>
                  </div>
                </ProCard.Content>
                <ProCard.Actions>
                  <Button variant="outline" className="w-full">
                    Ver perfil completo
                  </Button>
                </ProCard.Actions>
              </ProCard>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 border-t pt-8">
        <Text variant="heading" size="xl" className="mb-4">
          Referencia de API
        </Text>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border p-2 text-left">Componente</th>
                <th className="border p-2 text-left">Props</th>
                <th className="border p-2 text-left">Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 font-medium">ProCard</td>
                <td className="border p-2">
                  <code>variant?: ProCardVariant</code>
                  <br />
                  <code>border?: "none" | "normal" | "top" | "left"</code>
                  <br />
                  <code>borderVariant?: ProCardVariant</code>
                  <br />
                  <code>selected?: boolean</code>
                  <br />
                  <code>loading?: boolean</code>
                </td>
                <td className="border p-2">Componente principal de tarjeta</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">ProCard.Header</td>
                <td className="border p-2">
                  <code>className?: string</code>
                </td>
                <td className="border p-2">
                  Sección de encabezado de la tarjeta
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">ProCard.Title</td>
                <td className="border p-2">
                  <code>className?: string</code>
                </td>
                <td className="border p-2">Título principal de la tarjeta</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">ProCard.Subtitle</td>
                <td className="border p-2">
                  <code>className?: string</code>
                </td>
                <td className="border p-2">Subtítulo o descripción breve</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">ProCard.Media</td>
                <td className="border p-2">
                  <code>className?: string</code>
                </td>
                <td className="border p-2">
                  Contenedor para imágenes o multimedia
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">ProCard.Content</td>
                <td className="border p-2">
                  <code>className?: string</code>
                </td>
                <td className="border p-2">
                  Contenido principal de la tarjeta
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">ProCard.Actions</td>
                <td className="border p-2">
                  <code>className?: string</code>
                </td>
                <td className="border p-2">
                  Contenedor para botones de acción
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">ProCard.Footer</td>
                <td className="border p-2">
                  <code>className?: string</code>
                </td>
                <td className="border p-2">
                  Pie de la tarjeta para información adicional
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
