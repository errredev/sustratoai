"use client";

import { useState } from "react";
import { ProCard } from "@/components/ui/pro-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ShowroomPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const variants = [
    "primary",
    "secondary",
    "tertiary",
    "accent",
    "success",
    "warning",
    "danger", // Cambiado de "error" a "danger"
    "neutral",
    "white",
  ] as const;

  const borders = ["none", "normal", "top", "left"] as const;

  const toggleLoading = () => {
    setLoading(!loading);
  };

  const handleSelect = (id: string) => {
    if (selected === id) {
      setSelected(null);
    } else {
      setSelected(id);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-center">ProCard Showroom</h1>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="loading-mode"
            checked={loading}
            onCheckedChange={toggleLoading}
          />
          <Label htmlFor="loading-mode">Modo Skeleton</Label>
        </div>

        <Button
          variant="outline"
          onClick={() => setSelected(null)}
          disabled={!selected}
        >
          Limpiar Selección
        </Button>
      </div>

      <Tabs defaultValue="none" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {borders.map((border) => (
            <TabsTrigger key={border} value={border} className="capitalize">
              Borde: {border === "none" ? "Ninguno" : border}
            </TabsTrigger>
          ))}
        </TabsList>

        {borders.map((border) => (
          <TabsContent key={border} value={border} className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {variants.map((variant) => {
                const cardId = `${variant}-${border}`;
                return (
                  <ProCard
                    key={cardId}
                    variant={variant}
                    border={border}
                    selected={selected === cardId}
                    loading={loading}
                    onClick={() => handleSelect(cardId)}
                    className="cursor-pointer hover:shadow-md"
                  >
                    <Header>
                      <Title fontType="heading" className="capitalize">
                        {variant}
                      </Title>
                    </Header>
                    <Content>
                      <p className="text-sm text-muted-foreground">
                        ProCard con variante <strong>{variant}</strong> y borde{" "}
                        <strong>{border}</strong>
                      </p>
                    </Content>
                    <Footer>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant={
                            variant === "primary" ? "default" : "outline"
                          }
                        >
                          Acción
                        </Button>
                      </div>
                    </Footer>
                  </ProCard>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
