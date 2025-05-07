"use client";

import { useState, useEffect } from "react";
import { PageBackground } from "@/components/ui/page-background";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ProCard } from "@/components/ui/pro-card";
import { useTheme } from "@/app/theme-provider";

export default function ProgressShowroom() {
  const { colorScheme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Efecto para simular progreso
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsRunning(false);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Función para controlar el progreso
  const toggleProgress = () => {
    setIsRunning((prev) => !prev);
    if (progress >= 100) {
      setProgress(0);
    }
  };

  return (
    <PageBackground variant="gradient">
      <div className="container mx-auto py-8 px-4">
        <Text as="h1" size="3xl" weight="bold" className="mb-6">
          Componente de Progreso
        </Text>

        <Text as="p" size="lg" className="mb-8">
          Este showroom muestra las diferentes variantes y opciones del
          componente Progress.
        </Text>

        <ProCard className="mb-8 p-6">
          <Header>
            <Title fontType="heading">Progreso Interactivo</Title>
          </Header>
          <Content>
            <Progress
              value={progress}
              max={100}
              className="mb-4"
              label="Progreso simulado"
              showValue
            />

            <Button onClick={toggleProgress} className="mt-2">
              {isRunning ? "Pausar" : progress > 0 ? "Continuar" : "Iniciar"}{" "}
              Progreso
            </Button>
          </Content>
        </ProCard>

        <Divider className="my-8" />

        <ProCard className="mb-8 p-6">
          <Header>
            <Title fontType="heading">Termómetro (Rojo a Verde)</Title>
          </Header>
          <Content>
            <div className="space-y-6">
              <div>
                <Text as="p" size="sm" className="mb-2">
                  Termómetro al 25%
                </Text>
                <Progress value={25} variant="termometro" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Termómetro al 50%
                </Text>
                <Progress value={50} variant="termometro" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Termómetro al 75%
                </Text>
                <Progress value={75} variant="termometro" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Termómetro al 100%
                </Text>
                <Progress value={100} variant="termometro" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Termómetro con Acento
                </Text>
                <Progress value={75} variant="termometro" degradadoAccent />
              </div>
            </div>
          </Content>
        </ProCard>

        <Divider className="my-8" />

        <ProCard className="mb-8 p-6">
          <Header>
            <Title fontType="heading">Degradados</Title>
          </Header>
          <Content>
            <div className="space-y-6">
              <div>
                <Text as="p" size="sm" className="mb-2">
                  Primary con Degradado (por defecto)
                </Text>
                <Progress value={70} variant="primary" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Primary sin Degradado
                </Text>
                <Progress value={70} variant="primary" degradado={false} />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Primary con Degradado Accent
                </Text>
                <Progress value={70} variant="primary" degradadoAccent />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Success con Degradado
                </Text>
                <Progress value={70} variant="success" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Success con Degradado Accent
                </Text>
                <Progress value={70} variant="success" degradadoAccent />
              </div>
            </div>
          </Content>
        </ProCard>

        <Divider className="my-8" />

        <ProCard className="mb-8 p-6">
          <Header>
            <Title fontType="heading">Variantes de Color</Title>
          </Header>
          <Content>
            <div className="space-y-6">
              <div>
                <Text as="p" size="sm" className="mb-2">
                  Primary
                </Text>
                <Progress value={70} variant="primary" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Secondary
                </Text>
                <Progress value={70} variant="secondary" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Tertiary
                </Text>
                <Progress value={70} variant="tertiary" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Accent
                </Text>
                <Progress value={70} variant="accent" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Success
                </Text>
                <Progress value={70} variant="success" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Warning
                </Text>
                <Progress value={70} variant="warning" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Danger
                </Text>
                <Progress value={70} variant="danger" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Neutral
                </Text>
                <Progress value={70} variant="neutral" />
              </div>
            </div>
          </Content>
        </ProCard>

        <Divider className="my-8" />

        <ProCard className="mb-8 p-6">
          <Header>
            <Title fontType="heading">Tamaños</Title>
          </Header>
          <Content>
            <div className="space-y-6">
              <div>
                <Text as="p" size="sm" className="mb-2">
                  Extra Small (xs)
                </Text>
                <Progress value={70} size="xs" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Small (sm)
                </Text>
                <Progress value={70} size="sm" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Medium (md - default)
                </Text>
                <Progress value={70} size="md" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Large (lg)
                </Text>
                <Progress value={70} size="lg" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Extra Large (xl)
                </Text>
                <Progress value={70} size="xl" />
              </div>
            </div>
          </Content>
        </ProCard>

        <Divider className="my-8" />

        <ProCard className="mb-8 p-6">
          <Header>
            <Title fontType="heading">Progreso Indeterminado</Title>
          </Header>
          <Content>
            <div className="space-y-6">
              <div>
                <Text as="p" size="sm" className="mb-2">
                  Primary
                </Text>
                <Progress indeterminate variant="primary" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Success
                </Text>
                <Progress indeterminate variant="success" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Warning
                </Text>
                <Progress indeterminate variant="warning" />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Danger
                </Text>
                <Progress indeterminate variant="danger" />
              </div>
            </div>
          </Content>
        </ProCard>

        <Divider className="my-8" />

        <ProCard className="mb-8 p-6">
          <Header>
            <Title fontType="heading">Sin Animación</Title>
          </Header>
          <Content>
            <div className="space-y-6">
              <div>
                <Text as="p" size="sm" className="mb-2">
                  Progreso sin animación
                </Text>
                <Progress value={70} animated={false} />
              </div>

              <div>
                <Text as="p" size="sm" className="mb-2">
                  Indeterminado sin animación
                </Text>
                <Progress indeterminate animated={false} />
              </div>
            </div>
          </Content>
        </ProCard>
      </div>
    </PageBackground>
  );
}
