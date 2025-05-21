// app/showroom/formbeta/page.tsx
"use client";

import React from "react";
import { useForm, SubmitHandler, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formBetaSchema, type FormBetaValues } from "./schema";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { CustomButton } from "@/components/ui/custom-button";
import { ProCard } from "@/components/ui/pro-card";
import { Text } from "@/components/ui/text";
import { toast } from "sonner";
import { 
  Mail, User, UserCog, CalendarDays, Fingerprint, KeyRound, Edit3, ShieldCheck, Eye
} from "lucide-react";
import type { InputVariant } from "@/lib/theme/components/input-tokens";
import { TextArea } from "@/components/ui/textarea";


type FormMode = "view" | "create" | "edit";

const initialFormData: FormBetaValues = {
  email: "ada.lovelace@example.com",
  username: "ada_the_first",
  firstName: "Augusta Ada",
  lastName: "King-Noel",
  birthDate: "1815-12-10",
  rut: "12.345.678-K",
  accessCode: "CODE01",
  description: "Esta es una descripción de prueba."
};

const checkLiveDateFormat = (value: string): string | undefined => {
  if (!value) return undefined;
  if (!/^[0-9-]*$/.test(value)) return "Solo números y guiones";
  const parts = value.split('-');
  if (parts.length > 3) return "Demasiados guiones";
  if (parts[0] && parts[0].length > 4) return "Año > 4 dígitos";
  if (parts[1] && parts[1].length > 2) return "Mes > 2 dígitos";
  if (parts[2] && parts[2].length > 2) return "Día > 2 dígitos";
  if (value.length === 10 && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Formato YYYY-MM-DD";
  return undefined;
};

export default function FormBetaShowroomPage() {
  const [currentMode, setCurrentMode] = React.useState<FormMode>("create");
  const [formDataForView, setFormDataForView] = React.useState<FormBetaValues>({ ...initialFormData });
  const [submissionStatus, setSubmissionStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [currentVariant, setCurrentVariant] = React.useState<InputVariant>("default");
  
  const isReadOnlyViewMode = currentMode === "view";
  const isFormEditingMode = currentMode === "edit";

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValidating, touchedFields, dirtyFields },
    reset,
    watch,
    control,
    setValue,
    setError,
  } = useForm<FormBetaValues>({
    resolver: zodResolver(formBetaSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: currentMode === "create" ? {} : { ...formDataForView },
  });

  React.useEffect(() => {
    if (currentMode === "create") {
      reset({});
    } else {
      reset({ ...formDataForView });
    }
    setSubmissionStatus("idle");
  }, [currentMode, formDataForView, reset]);

  const onValidSubmit: SubmitHandler<FormBetaValues> = async (data) => {
    console.log("FormBeta_OnSubmit (Válido) Intentando enviar:", data);
    setSubmissionStatus("idle");
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (data.username === "test_error_server") {
      setError("username", { type: "server", message: "Este nombre de usuario ya existe (error del servidor)." });
      setError("email", { type: "server", message: "El correo podría estar duplicado (error del servidor)." });
      toast.error("Error del servidor", {
          description: "No se pudieron guardar los datos. Intenta de nuevo.",
          duration: 5000,
      });
      setSubmissionStatus("error");
      return;
    }
    
    toast.success("¡Formulario enviado con éxito!", {
      description: "Tus datos han sido guardados (simulado).",
      duration: 3000,
    });
    setFormDataForView({ ...data });
    setSubmissionStatus("success");
    setCurrentMode("view");
  };

  const onInvalidSubmit = (formErrors: FieldErrors<FormBetaValues>) => {
    console.log("FormBeta_OnSubmit (Inválido):", formErrors);
    toast.error("El formulario tiene errores.", {
      description: "Por favor, revisa los campos marcados e inténtalo de nuevo.",
      duration: 5000,
    });
    setSubmissionStatus("error");
  };

  const handleModeChange = (mode: FormMode) => {
    setCurrentMode(mode);
  };

  const getSuccessState = (fieldName: keyof FormBetaValues, fieldError?: string, liveFormatError?: string) => {
    if (isReadOnlyViewMode) return false;
    if (fieldError || liveFormatError) return false;
    
    const fieldHasValue = !!watch(fieldName);
    const isValidAndTouched = (touchedFields[fieldName] || dirtyFields[fieldName]) && fieldHasValue;
    const formSuccessAndFieldValid = submissionStatus === 'success' && fieldHasValue;
    
    return isValidAndTouched || formSuccessAndFieldValid;
  };
  
  const isFieldRequired = (fieldName: keyof FormBetaValues): boolean => {
    if (isReadOnlyViewMode) return false; // Campos no son "requeridos" para la interacción en modo vista
    // @ts-ignore - Zod's shape type can be tricky, this is a common way to check
    const fieldSchema = formBetaSchema.shape[fieldName];
    // Un campo es requerido si no es opcional y no es nullable/undefinable por defecto en Zod
    // La forma más directa de chequearlo con Zod v3 es si .isOptional() o .isNullable() no están en su definición,
    // o si no tiene un .default(). Para simplicidad, chequeamos si no es explícitamente opcional.
    // Zod considera un campo requerido si no se marca con .optional() o .nullable()
    // y no tiene un .default()
    // La forma más robusta es ver si !fieldSchema.isOptional() (si existe tal método)
    // o si no tiene _def.typeName que indique opcionalidad.
    // Para Zod, si no llamas a .optional() o .nullable(), es requerido.
    // Una forma simple de verificarlo programáticamente si no tenemos .isOptional()
    // es intentar parsear un objeto vacío y ver si falla para ese campo.
    // Sin embargo, para UI, solemos definirlo explícitamente.
    // Aquí usaremos la prop 'isRequired' de FormField que ya define la obligatoriedad en la UI.
    // Para el atributo aria-required, la prop de FormField es la fuente de verdad.
    
    // Esta es una simplificación, Zod v3 no tiene un `isOptional()` directo en el schema del campo.
    // Podrías inferirlo basado en la definición o pasar explícitamente.
    // Por ahora, usaremos la lógica de FormField, pero idealmente esto se alinea con Zod.
    // Para 'accessCode' y 'email' sabemos que son requeridos por el schema.
    if (fieldName === 'email' || fieldName === 'username' || fieldName === 'accessCode') return true;
    return false; // Por defecto para los otros campos opcionales en este form.
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      <ProCard className="max-w-3xl mx-auto">
        <ProCard.Header className="space-y-4">
          <Text variant="heading" size="2xl" color="primary">
            Showroom: Formulario Beta (Semilla Fractal ARIA)
          </Text>
          <Text>
            Probando `CustomInputExperimental` con ARIA, validaciones, formatos y modos.
          </Text>
          <div className="flex flex-wrap gap-2 border-b pb-4">
            <CustomButton
              onClick={() => handleModeChange("create")}
              variant={currentMode === "create" ? "solid" : "outline"}
              color="primary" leftIcon={<Edit3 />}
            > Crear </CustomButton>
            <CustomButton
              onClick={() => handleModeChange("edit")}
              variant={currentMode === "edit" ? "solid" : "outline"}
              color="secondary" leftIcon={<Edit3 />}
              disabled={Object.keys(formDataForView).every(k => !formDataForView[k as keyof FormBetaValues]) && !initialFormData.email}
            > Modificar </CustomButton>
            <CustomButton
              onClick={() => handleModeChange("view")}
              variant={currentMode === "view" ? "solid" : "outline"}
              color="default" leftIcon={<Eye />}
              disabled={Object.keys(formDataForView).every(k => !formDataForView[k as keyof FormBetaValues]) && !initialFormData.email}
            > Ver (ReadOnly) </CustomButton>
          </div>
          <div className="pt-2">
            <Text size="sm" color="neutral" className="mb-1">Variante de Inputs:</Text>
            <CustomButton size="xs" onClick={() => setCurrentVariant(currentVariant === "default" ? "primary" : "default")}>
              Cambiar a {currentVariant === "default" ? "Primary" : "Default"}
            </CustomButton>
          </div>
        </ProCard.Header>

        <ProCard.Content>
          <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="space-y-7">
            
            <FormField 
              label="Correo Electrónico" 
              htmlFor="email-input"
              isRequired={isFieldRequired("email")}
            >
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => (
                  <Input
                    id="email-input"
                    type="email" leadingIcon={Mail} placeholder="tu@correo.com"
                    autoComplete="email"
                    error={!isReadOnlyViewMode ? fieldState.error?.message : undefined}
                    success={getSuccessState("email", fieldState.error?.message)}
                    successMessage="Correo válido"
                    readOnly={isReadOnlyViewMode}
                    isEditing={isFormEditingMode && !isReadOnlyViewMode}
                    variant={currentVariant}
                    {...field} value={field.value || ""}
                    isRequired={isFieldRequired("email")}
                    hint="Escribe tu dirección de correo completa."
                  />
                )}
              />
            </FormField>

            <FormField 
              label="Nombre de Usuario" 
              htmlFor="username-input" 
              isRequired={isFieldRequired("username")}
            >
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => (
                  <Input
                    id="username-input" 
                    leadingIcon={UserCog} placeholder="Ej: ada_coder (o test_error_server)"
                    autoComplete="username"
                    error={!isReadOnlyViewMode ? fieldState.error?.message : undefined}
                    success={getSuccessState("username", fieldState.error?.message)}
                    successMessage="Nombre de usuario parece bien"
                    readOnly={isReadOnlyViewMode}
                    isEditing={isFormEditingMode && !isReadOnlyViewMode}
                    variant={currentVariant}
                    {...field} value={field.value || ""}
                    isRequired={isFieldRequired("username")}
                    hint="De 3 a 20 caracteres, solo letras, números y guion bajo."
                  />
                )}
              />
            </FormField>
            
            <FormField 
              label="Primer Nombre" 
              htmlFor="firstName-input" 
              isRequired={isFieldRequired("firstName")}
            >
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => (
                  <Input
                    id="firstName-input" leadingIcon={User} placeholder="Ej: Augusta Ada"
                    autoComplete="given-name"
                    error={!isReadOnlyViewMode ? fieldState.error?.message : undefined}
                    success={getSuccessState("firstName", fieldState.error?.message)}
                    readOnly={isReadOnlyViewMode}
                    isEditing={isFormEditingMode && !isReadOnlyViewMode}
                    variant={currentVariant}
                    {...field} value={field.value || ""}
                    isRequired={isFieldRequired("firstName")}
                  />
                )}
              />
            </FormField>

            <FormField 
              label="Apellido" 
              htmlFor="lastName-input" 
              isRequired={isFieldRequired("lastName")}
            >
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => (
                  <Input
                    id="lastName-input" leadingIcon={User} placeholder="Ej: King-Noel"
                    autoComplete="family-name"
                    error={!isReadOnlyViewMode ? fieldState.error?.message : undefined}
                    success={getSuccessState("lastName", fieldState.error?.message)}
                    readOnly={isReadOnlyViewMode}
                    isEditing={isFormEditingMode && !isReadOnlyViewMode}
                    variant={currentVariant}
                    {...field} value={field.value || ""}
                    isRequired={isFieldRequired("lastName")}
                  />
                )}
              />
            </FormField>

            <FormField 
              label="Fecha de Nacimiento (YYYY-MM-DD)" 
              htmlFor="birthDate-input" 
              isRequired={isFieldRequired("birthDate")}
            >
              <Controller
                name="birthDate"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => {
                  const liveFormatError = checkLiveDateFormat(field.value || "");
                  const displayError = !isReadOnlyViewMode ? (fieldState.error?.message || liveFormatError) : undefined;
                  const isSuccess = getSuccessState("birthDate", fieldState.error?.message, liveFormatError);
                  return (
                    <Input
                      id="birthDate-input" type="text" leadingIcon={CalendarDays} placeholder="YYYY-MM-DD"
                      autoComplete="bday"
                      error={displayError}
                      success={isSuccess}
                      successMessage="Fecha parece válida"
                      readOnly={isReadOnlyViewMode}
                      isEditing={isFormEditingMode && !isReadOnlyViewMode}
                      variant={currentVariant}
                      {...field} value={field.value || ""}
                      isRequired={isFieldRequired("birthDate")}
                      hint="Formato YYYY-MM-DD. Ejemplo: 1990-12-31"
                    />);
                }}/>
            </FormField>
            // En app/showroom/formbeta/page.tsx (ya presente)
            <FormField 
              label="Descripción (Opcional)" 
              htmlFor="description-input" 
              isRequired={isFieldRequired("description")}
            >
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => (
                  <TextArea
                    id="description-input"
                    placeholder="Escribe una breve descripción aquí..."
                    rows={4}
                    error={!isReadOnlyViewMode ? fieldState.error?.message : undefined}
                    success={getSuccessState("description", fieldState.error?.message)}
                    readOnly={isReadOnlyViewMode}
                    isEditing={isFormEditingMode && !isReadOnlyViewMode}
                    variant={"default"} 
                    {...field} value={field.value || ""}
                    isRequired={isFieldRequired("description")}
                    maxLength={500} // Para el contador
                    showCharacterCount // Para mostrar el contador
                    hint="Máximo 500 caracteres para la descripción."
                  />
                )}
              />
            </FormField>
            <FormField 
              label="RUT Chileno (Opcional)" 
              htmlFor="rut-input" 
              isRequired={isFieldRequired("rut")}
            >
               <Controller
                name="rut"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => {
                  const displayError = !isReadOnlyViewMode ? fieldState.error?.message : undefined;
                  const isSuccess = getSuccessState("rut", fieldState.error?.message);
                  return (
                      <Input
                      id="rut-input" leadingIcon={Fingerprint} placeholder="Ej: 12.345.678-K"
                      error={displayError}
                      success={isSuccess}
                      readOnly={isReadOnlyViewMode}
                      isEditing={isFormEditingMode && !isReadOnlyViewMode}
                      variant={currentVariant}
                      {...field} value={field.value || ""}
                      isRequired={isFieldRequired("rut")}
                    />
                  );
                }}
              />
            </FormField>

            <FormField 
              label="Código de Acceso (6 caracteres)" 
              htmlFor="accessCode-input" 
              isRequired={isFieldRequired("accessCode")}
            >
              <Controller
                name="accessCode"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => (
                      
                    <Input
                    id="accessCode-input" leadingIcon={KeyRound} placeholder="XXXXXX"
                    maxLength={6} showCharacterCount
                    autoComplete="one-time-code"
                    error={!isReadOnlyViewMode ? fieldState.error?.message : undefined}
                    success={getSuccessState("accessCode", fieldState.error?.message) && (field.value || "").length === 6}
                    successMessage="Código OK"
                    readOnly={isReadOnlyViewMode}
                    isEditing={isFormEditingMode && !isReadOnlyViewMode}
                    variant={currentVariant}
                    {...field} value={field.value || ""}
                    isRequired={isFieldRequired("accessCode")}
                    hint="Debe contener exactamente 6 caracteres alfanuméricos."
                  />
                )}
              />
            </FormField>
            
            {!isReadOnlyViewMode && (
              <div className="pt-6">
                <CustomButton type="submit" color="primary" fullWidth loading={isSubmitting || isValidating} disabled={isSubmitting || isValidating}>
                  {isSubmitting ? "Enviando..." : (currentMode === "create" ? "Crear Registro" : "Guardar Cambios")}
                </CustomButton>
              </div>
            )}

            {isReadOnlyViewMode && (Object.keys(formDataForView).length > 0 && !!formDataForView.email) && (
                 <div className="pt-6 flex flex-wrap gap-2">
                    <CustomButton onClick={() => handleModeChange("edit")} color="secondary" leftIcon={<Edit3/>}>
                        Modificar estos datos
                    </CustomButton>
                     <CustomButton onClick={() => handleModeChange("create")} color="primary" variant="outline" leftIcon={<Edit3/>}>
                        Crear Nuevo
                    </CustomButton>
                </div>
            )}
          </form>
        </ProCard.Content>
        <ProCard.Footer>
          <Text variant="caption" color="neutral" colorVariant="textShade">
            {currentMode === "view" ? "Mostrando datos guardados." : (submissionStatus === "success" ? "¡Datos guardados con éxito!" : "Prueba las validaciones y los diferentes modos.")}
          </Text>
        </ProCard.Footer>
      </ProCard>
    </div>
  );
}