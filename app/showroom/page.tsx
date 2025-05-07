"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Search, Mail, User, Lock, Eye, EyeOff, Info } from "lucide-react"

export default function ShowroomPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [inputValues, setInputValues] = useState({
    default: "",
    withIcon: "",
    withError: "Valor con error",
    withSuccess: "Valor correcto",
    password: "contraseña123",
    withHint: "",
    withCounter: "",
    editing: "Valor en edición",
    readonly: "Este campo es de solo lectura",
    clearable: "",
  })

  const [textareaValues, setTextareaValues] = useState({
    default: "",
    withError: "Texto con error que debería mostrarse con estilo de error",
    withHint: "",
    withCounter: "",
    autoGrow:
      "Este textarea crece automáticamente a medida que escribes más contenido. Prueba a escribir varias líneas para ver cómo se ajusta la altura.",
    editing: "Texto en modo edición que debería tener un fondo diferente",
    readonly: "Este campo es de solo lectura y no se puede modificar",
  })

  const handleInputChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({ ...prev, [name]: e.target.value }))
  }

  const handleTextareaChange = (name: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValues((prev) => ({ ...prev, [name]: e.target.value }))
  }

  const clearInput = (name: string) => {
    setInputValues((prev) => ({ ...prev, [name]: "" }))
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Showroom de Componentes</h1>
      <p className="text-muted-foreground mb-8">
        Esta página muestra todas las variantes y funcionalidades de los componentes de formulario mejorados.
      </p>

      <Tabs defaultValue="inputs">
        <TabsList className="mb-8">
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="textareas">Textareas</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Variantes básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Variantes básicas</CardTitle>
                <CardDescription>Diferentes estilos para diferentes estados del input</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default</label>
                  <Input
                    placeholder="Input por defecto"
                    value={inputValues.default}
                    onChange={handleInputChange("default")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Editing</label>
                  <Input
                    variant="editing"
                    placeholder="Input en modo edición"
                    value={inputValues.editing}
                    onChange={handleInputChange("editing")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Error</label>
                  <Input
                    variant="error"
                    placeholder="Input con error"
                    value={inputValues.withError}
                    onChange={handleInputChange("withError")}
                    error="Este campo contiene un error"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Success</label>
                  <Input
                    variant="success"
                    placeholder="Input con éxito"
                    value={inputValues.withSuccess}
                    onChange={handleInputChange("withSuccess")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Read-only</label>
                  <Input variant="readonly" placeholder="Input de solo lectura" value={inputValues.readonly} readOnly />
                </div>
              </CardContent>
            </Card>

            {/* Iconos y características */}
            <Card>
              <CardHeader>
                <CardTitle>Iconos y características</CardTitle>
                <CardDescription>Inputs con iconos y funcionalidades adicionales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Con icono inicial</label>
                  <Input
                    leadingIcon={<Search className="h-4 w-4" />}
                    placeholder="Buscar..."
                    value={inputValues.withIcon}
                    onChange={handleInputChange("withIcon")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Con icono final</label>
                  <Input
                    trailingIcon={<Info className="h-4 w-4" />}
                    placeholder="Información"
                    value={inputValues.withIcon}
                    onChange={handleInputChange("withIcon")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Con texto de ayuda</label>
                  <Input
                    placeholder="Ingrese su nombre"
                    hint="Este campo es opcional"
                    value={inputValues.withHint}
                    onChange={handleInputChange("withHint")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Con contador de caracteres</label>
                  <Input
                    placeholder="Máximo 20 caracteres"
                    maxLength={20}
                    showCharacterCount
                    value={inputValues.withCounter}
                    onChange={handleInputChange("withCounter")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contraseña con toggle</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    leadingIcon={<Lock className="h-4 w-4" />}
                    trailingIcon={
                      showPassword ? (
                        <EyeOff className="h-4 w-4 cursor-pointer" onClick={() => setShowPassword(false)} />
                      ) : (
                        <Eye className="h-4 w-4 cursor-pointer" onClick={() => setShowPassword(true)} />
                      )
                    }
                    placeholder="Contraseña"
                    value={inputValues.password}
                    onChange={handleInputChange("password")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Con botón para limpiar</label>
                  <Input
                    placeholder="Escribe algo y limpia"
                    value={inputValues.clearable}
                    onChange={handleInputChange("clearable")}
                    onClear={() => clearInput("clearable")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ejemplos de uso común */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Ejemplos de uso común</CardTitle>
                <CardDescription>Ejemplos de formularios comunes usando los componentes mejorados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Formulario de contacto</h3>

                    <Input leadingIcon={<User className="h-4 w-4" />} placeholder="Nombre completo" />

                    <Input leadingIcon={<Mail className="h-4 w-4" />} placeholder="Correo electrónico" type="email" />

                    <Textarea placeholder="Mensaje" showCharacterCount maxLength={200} />

                    <Button>Enviar mensaje</Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Formulario de institución</h3>

                    <Input
                      leadingIcon={<Building2 className="h-4 w-4" />}
                      placeholder="Código (2 caracteres)"
                      maxLength={2}
                      showCharacterCount
                    />

                    <Input placeholder="Nombre de la institución" />

                    <Textarea
                      placeholder="Descripción de la institución"
                      hint="Información adicional sobre la institución (opcional)"
                      autoGrow
                    />

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancelar</Button>
                      <Button>Guardar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="textareas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Variantes básicas de Textarea */}
            <Card>
              <CardHeader>
                <CardTitle>Variantes básicas</CardTitle>
                <CardDescription>Diferentes estilos para diferentes estados del textarea</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default</label>
                  <Textarea
                    placeholder="Textarea por defecto"
                    value={textareaValues.default}
                    onChange={handleTextareaChange("default")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Editing</label>
                  <Textarea
                    variant="editing"
                    placeholder="Textarea en modo edición"
                    value={textareaValues.editing}
                    onChange={handleTextareaChange("editing")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Error</label>
                  <Textarea
                    variant="error"
                    placeholder="Textarea con error"
                    value={textareaValues.withError}
                    onChange={handleTextareaChange("withError")}
                    error="Este campo contiene un error"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Read-only</label>
                  <Textarea
                    variant="readonly"
                    placeholder="Textarea de solo lectura"
                    value={textareaValues.readonly}
                    readOnly
                  />
                </div>
              </CardContent>
            </Card>

            {/* Características adicionales de Textarea */}
            <Card>
              <CardHeader>
                <CardTitle>Características adicionales</CardTitle>
                <CardDescription>Textareas con funcionalidades adicionales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Con texto de ayuda</label>
                  <Textarea
                    placeholder="Ingrese su descripción"
                    hint="Este campo es opcional"
                    value={textareaValues.withHint}
                    onChange={handleTextareaChange("withHint")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Con contador de caracteres</label>
                  <Textarea
                    placeholder="Máximo 100 caracteres"
                    maxLength={100}
                    showCharacterCount
                    value={textareaValues.withCounter}
                    onChange={handleTextareaChange("withCounter")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Con auto-crecimiento</label>
                  <Textarea
                    placeholder="Este textarea crece automáticamente"
                    autoGrow
                    value={textareaValues.autoGrow}
                    onChange={handleTextareaChange("autoGrow")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
