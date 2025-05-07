import { SustratoLoadingLogo } from "@/components/ui/sustrato-loading-logo"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SustratoLoadingLogo
        size={96}
        variant="spin-pulse"
        showText={true}
        text="Cargando showroom..."
        breathingEffect={true}
        colorTransition={true}
      />
    </div>
  )
}
