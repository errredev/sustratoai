"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth-provider";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Text } from "@/components/ui/text";
import { ProCard } from "@/components/ui/pro-card";
import { CustomButton } from "@/components/ui/custom-button";
import { UserPlus } from "lucide-react";
import { TablaInvestigadores } from "@/app/datos-maestros/investigadores/components/tabla-investigadores";
import { FormularioInvestigador } from "@/app/datos-maestros/investigadores/components/formulario-investigador";
import { 
  obtenerInvestigadoresProyecto, 
  verificarPermisoAsignarInvestigadores 
} from "@/app/actions/perfil-investigador-actions";

// Estado para almacenar el ID del proyecto seleccionado


export default function InvestigadoresPage() {
  const { user } = useAuth();
  const [investigadores, setInvestigadores] = useState<Investigador[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [tienePermiso, setTienePermiso] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [investigadorEditar, setInvestigadorEditar] = useState<Investigador | null>(null);
  const [proyectoId, setProyectoId] = useState("1"); // Valor por defecto
  interface Proyecto {
    id: string;
    nombre: string;
  }
  
  // Usar un tipo genérico para resolver la incompatibilidad de interfaces
  type InvestigadorData = {
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
    cargo: {
      id: string;
      nombre: string;
      asignar_investigadores: boolean;
    };
  };
  
  // Usamos el tipo de datos de la tabla de investigadores
  type Investigador = InvestigadorData;
  const [proyectos, setProyectos] = useState<Proyecto[]>([]); // Lista de proyectos disponibles
  const [cargandoProyectos, setCargandoProyectos] = useState(true);

  useEffect(() => {
    async function cargarProyectos() {
      setCargandoProyectos(true);
      try {
        // Esta es una función hipotética que habría que implementar
        // Para propósitos de demostración, usaremos proyectos hardcodeados
        // Aquí debería ir la llamada a la base de datos real
        const proyectosDisponibles = [
          { id: "1", nombre: "Proyecto 1" },
          { id: "2", nombre: "Proyecto 2" },
          { id: "3", nombre: "Proyecto 3" }
        ];
        setProyectos(proyectosDisponibles);
        // Si no hay proyecto seleccionado, seleccionar el primero por defecto
        if (proyectosDisponibles.length > 0 && !proyectoId) {
          setProyectoId(proyectosDisponibles[0].id);
        }
      } catch (err) {
        console.error("Error al cargar proyectos:", err);
      } finally {
        setCargandoProyectos(false);
      }
    }
    
    cargarProyectos();
  }, []);

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      setError("");

      try {
        // Verificar permisos del usuario actual
        if (user && proyectoId) {
          const resultPermiso = await verificarPermisoAsignarInvestigadores(user.id, proyectoId);
          setTienePermiso(resultPermiso.tienePermiso || false);
          
          // Cargar los investigadores
          const result = await obtenerInvestigadoresProyecto(proyectoId);
          
          if (result.error) {
            console.error('Error específico:', result.error);
            setError(`Error al obtener investigadores: ${result.error}`);
          } else {
            setInvestigadores(result.data || []);
          }
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(`Error al cargar los datos: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setCargando(false);
      }
    }

    if (user && proyectoId) {
      cargarDatos();
    }
  }, [user, proyectoId]);

  const abrirModalCrear = () => {
    setInvestigadorEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (investigador: Investigador) => {
    setInvestigadorEditar(investigador);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setInvestigadorEditar(null);
  };

  const onGuardadoExitoso = async () => {
    cerrarModal();
    
    // Recargar la lista de investigadores
    try {
      const result = await obtenerInvestigadoresProyecto(proyectoId);
      if (result.success) {
        setInvestigadores(result.data || []);
      }
    } catch (err) {
      console.error("Error al recargar datos:", err);
    }
  };

  return (
    <PageWrapper>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <Text variant="heading">Investigadores</Text>
          
          <div className="flex space-x-3">
              {/* Selector de proyectos */}
              <div className="flex items-center">
                <label className="mr-2 text-sm font-medium">Proyecto:</label>
                <select 
                  value={proyectoId}
                  onChange={(e) => setProyectoId(e.target.value)}
                  className="rounded-md border border-input bg-transparent px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={cargandoProyectos}
                >
                  {cargandoProyectos ? (
                    <option>Cargando...</option>
                  ) : (
                    proyectos.map((proyecto) => (
                      <option key={proyecto.id} value={proyecto.id}>
                        {proyecto.nombre}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Botón para agregar investigador */}
              {tienePermiso && (
                <CustomButton 
                  color="primary"
                  variant="solid"
                  onClick={abrirModalCrear}
                  leftIcon={<UserPlus size={16} />}
                >
                  Agregar investigador
                </CustomButton>
              )}
            </div>
          </div>

        {error ? (
          <ProCard>
            <ProCard.Content>
              <Text variant="default" className="text-danger">
                {error}
              </Text>
            </ProCard.Content>
          </ProCard>
        ) : (
          <TablaInvestigadores 
            investigadores={investigadores} 
            cargando={cargando} 
            tienePermiso={tienePermiso}
            onEditar={abrirModalEditar}
            proyectoId={proyectoId}
          />
        )}
      </div>

      {modalAbierto && (
        <FormularioInvestigador
          isOpen={modalAbierto}
          onClose={cerrarModal}
          investigador={investigadorEditar}
          proyectoId={proyectoId}
          onSuccess={onGuardadoExitoso}
        />
      )}
    </PageWrapper>
  );
}
