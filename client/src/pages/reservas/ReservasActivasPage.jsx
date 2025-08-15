import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Search } from "lucide-react"

import ReservasActivas from "@/components/dashboard/ReservasActivas"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function ReservasActivasPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Mis Reservas Activas</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gestiona todas tus reservas de aparcamiento actuales
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Link to="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>

          <div className="relative flex-1 md:w-[240px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar reservas..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <ReservasActivas searchTerm={searchTerm} isEmbedded={true} />
    </div>
  )
}