import { PageBackground } from "@/components/ui/page-background";
import { ProCard } from "@/components/ui/pro-card";
import { Text } from "@/components/ui/text";

export default function Loading() {
  return (
    <PageBackground variant="gradient">
      <div className="container mx-auto py-8">
        <ProCard border="bottom" className="p-6">
          <ProCard.Header>
            <ProCard.Title fontType="heading" size="3xl">
              Cargando Custom Check Showroom...
            </ProCard.Title>
          </ProCard.Header>
          <ProCard.Content>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-4 w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-4 w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-4 w-2/3"></div>
          </ProCard.Content>
        </ProCard>
      </div>
    </PageBackground>
  );
}
