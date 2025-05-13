"use client";

import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectCustom } from "@/components/ui/select-custom";
import { Text } from "@/components/ui/text";
import { CustomButton } from "@/components/ui/custom-button";
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  FileText, 
  Save, 
  Briefcase, 
  X 
} from "lucide-react";
import { 
  crearPerfilInvestigador, 
  actualizarPerfilInvestigador, 
  obtenerCargosProyecto,
  verificarUsuarioTienePerfil
} from "@/app/actions/perfil-investigador-actions";

interface Investigador {
  id: string;
  user_id: string;
  proyecto_id: string;
  cargo_id: string;
  nombre: string;
  apellido: string;
  institucion?: string;
  telefono?: string;
  notas?: string;
  email?: string;
  cargo?: {
    id: string;
    nombre: string;
    asignar_investigadores: boolean;
  };
}

interface FormularioInvestigadorProps {
  isOpen: boolean;
  onClose: () => void;
  investigador: Investigador | null;
  proyectoId: string;
  onSuccess: () => void;
}

export function FormularioInvestigador({
  isOpen,
  onClose,
  investigador,
  proyectoId,
  onSuccess
}: FormularioInvestigadorProps) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    institucion: "",
    telefono: "",
    notas: "",
    cargo_id: ""
  });
  
  // Estados para manejar la carga y errores
  const [cargos, setCargos] = useState<Array<{id: string; nombre: string; asignar_investigadores: boolean}>>([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [cargoOptions, setCargoOptions] = useState<{value: string; label: string}[]>([]);
  
  // Determinar si estamos en modo edición
  const modoEdicion = !!investigador;
  
  // Cargar datos iniciales
  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      setError("");
      
      try {
        // Cargar cargos del proyecto
        const resultCargos = await obtenerCargosProyecto(proyectoId);
        
        if (resultCargos.error) {
          setError(resultCargos.error);
        } else if (resultCargos.data) {
          setCargos(resultCargos.data);
          
          // Transformar los cargos en opciones para el select
          const options = resultCargos.data.map(cargo => ({
            value: cargo.id,
            label: cargo.nombre
          }));
          
          setCargoOptions(options);
        }
        
        // Si estamos en modo edición, cargar los datos del investigador
        if (investigador) {
          setFormData({
            nombre: investigador.nombre || "",
            apellido: investigador.apellido || "",
            email: investigador.email || "",
            institucion: investigador.institucion || "",
            telefono: investigador.telefono || "",
            notas: investigador.notas || "",
            cargo_id: investigador.cargo_id || ""
          });
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los datos. Por favor, intente de nuevo.");
      } finally {
        setCargando(false);
      }
    }
    
    if (isOpen) {
      cargarDatos();
    }
  }, [isOpen, investigador, proyectoId]);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar errores específicos
    if (field === 'email') {
      setEmailError("");
    }
  };
  
  // Validar email (solo en modo creación)
  const validarEmail = async () => {
    if (!modoEdicion && formData.email.trim()) {
      try {
        const resultVerificacion = await verificarUsuarioTienePerfil(formData.email, proyectoId);
        
        if (resultVerificacion.error) {
          setEmailError(resultVerificacion.error);
          return false;
        }
        
        if (resultVerificacion.tienePerfil) {
          setEmailError("Este usuario ya tiene un perfil en el proyecto");
          return false;
        }
        
        return true;
      } catch (err) {
        console.error("Error al verificar email:", err);
        setEmailError("Error al verificar el email. Por favor, intente de nuevo.");
        return false;
      }
    }
    
    return true;
  };
  
  // Validar formulario
  const validarFormulario = () => {
    let esValido = true;
    setError("");
    
    // Validar campos obligatorios
    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio");
      esValido = false;
    } else if (!formData.apellido.trim()) {
      setError("El apellido es obligatorio");
      esValido = false;
    } else if (!formData.cargo_id) {
      setError("Debe seleccionar un cargo");
      esValido = false;
    } else if (!modoEdicion && !formData.email.trim()) {
      setError("El email es obligatorio para crear un investigador");
      esValido = false;
    }
    
    return esValido;
  };
  
  // Manejar el envío del formulario
  const handleSubmit = async () => {
    // Validar formulario
    if (!validarFormulario()) return;
    
    // En modo creación, validar el email
    if (!modoEdicion) {
      const emailValido = await validarEmail();
      if (!emailValido) return;
    }
    
    setGuardando(true);
    setError("");
    
    try {
      let resultado;
      
      if (modoEdicion && investigador) {
        // Actualizar investigador existente
        resultado = await actualizarPerfilInvestigador(investigador.id, {
          proyecto_id: proyectoId,
          cargo_id: formData.cargo_id,
          nombre: formData.nombre,
          apellido: formData.apellido,
          institucion: formData.institucion,
          telefono: formData.telefono,
          notas: formData.notas
        });
      } else {
        // Crear nuevo investigador
        resultado = await crearPerfilInvestigador({
          proyecto_id: proyectoId,
          cargo_id: formData.cargo_id,
          nombre: formData.nombre,
          apellido: formData.apellido,
          institucion: formData.institucion,
          telefono: formData.telefono,
          notas: formData.notas,
          email: formData.email
        });
      }
      
      if (resultado.error) {
        setError(resultado.error);
      } else {
        onSuccess();
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("Error al guardar los datos. Por favor, intente de nuevo.");
    } finally {
      setGuardando(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {modoEdicion ? "Editar investigador" : "Agregar nuevo investigador"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {error && (
            <Text variant="default" className="text-danger mb-2">
              {error}
            </Text>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nombre" required>
              <Input
                variant="primary"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                leftIcon={User}
                disabled={cargando || guardando}
              />
            </FormField>
            
            <FormField label="Apellido" required>
              <Input
                variant="primary"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={(e) => handleChange("apellido", e.target.value)}
                leftIcon={User}
                disabled={cargando || guardando}
              />
            </FormField>
          </div>
          
          <FormField label="Institución">
            <Input
              variant="primary"
              placeholder="Institución"
              value={formData.institucion}
              onChange={(e) => handleChange("institucion", e.target.value)}
              leftIcon={Building}
              disabled={cargando || guardando}
            />
          </FormField>
          
          <FormField label="Cargo" required>
            <SelectCustom
              placeholder="Seleccione un cargo"
              options={cargoOptions}
              value={formData.cargo_id}
              onChange={(value) => handleChange("cargo_id", value as string)}
              leftIcon={Briefcase}
              disabled={cargando || guardando}
            />
          </FormField>
          
          {!modoEdicion && (
            <FormField label="Email" required error={emailError}>
              <Input
                variant="primary"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                leftIcon={Mail}
                disabled={cargando || guardando}
                error={!!emailError}
              />
            </FormField>
          )}
          
          <FormField label="Teléfono">
            <Input
              variant="primary"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              leftIcon={Phone}
              disabled={cargando || guardando}
            />
          </FormField>
          
          <FormField label="Notas">
            <Textarea
              variant="primary"
              placeholder="Notas adicionales"
              value={formData.notas}
              onChange={(e) => handleChange("notas", e.target.value)}
              disabled={cargando || guardando}
              className="min-h-[80px]"
            />
          </FormField>
        </div>
        
        <DialogFooter>
          <CustomButton
            variant="secondary"
            onClick={onClose}
            disabled={guardando}
            icon={X}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            variant="primary"
            onClick={handleSubmit}
            disabled={cargando || guardando}
            loading={guardando}
            icon={Save}
          >
            {guardando 
              ? (modoEdicion ? "Actualizando..." : "Guardando...") 
              : (modoEdicion ? "Actualizar" : "Guardar")}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
