import { useState, useEffect } from "react"
import { useProfile } from "@/hooks/useProfile"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { User, PhoneCall, Mail, Key } from "lucide-react"

function Perfil() {
  const { perfil, loading, error, actualizarPerfil, eliminarCuenta } = useProfile()
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    telefono: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (perfil) {
      setFormData(prevState => ({
        ...prevState,
        nombreCompleto: perfil.nombreCompleto || "",
        telefono: perfil.telefono || ""
      }))
    }
  }, [perfil])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))

    if (name === "newPassword" || name === "confirmPassword") {
      setPasswordError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSuccessMessage("")

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden")
      return
    }

    setIsSubmitting(true)
    try {
      const dataToSubmit = {
        nombreCompleto: formData.nombreCompleto || undefined,
        telefono: formData.telefono || undefined,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined
      }

      Object.keys(dataToSubmit).forEach(key => {
        if (dataToSubmit[key] === undefined) {
          delete dataToSubmit[key]
        }
      })

      await actualizarPerfil(dataToSubmit)
      setSuccessMessage("Perfil actualizado correctamente")

      setFormData(prevData => ({
        ...prevData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }))
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      alert(error.response?.data?.error || "Error al actualizar el perfil")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await eliminarCuenta()
      alert("Cuenta eliminada correctamente")
    } catch (error) {
      console.error("Error al eliminar cuenta:", error)
      alert(error.response?.data?.error || "Error al eliminar la cuenta")
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">Cargando...</div>
  }

  if (error) {
    return <div className="text-center text-red-600">Error al cargar los datos: {error}</div>
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">Configuración de Perfil</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <Tabs defaultValue="datos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="datos">Datos Personales</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="datos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tus datos personales. Esta información será visible para el administrador del sistema.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="nombreCompleto">Nombre completo</Label>
                    </div>
                    <Input
                      id="nombreCompleto"
                      name="nombreCompleto"
                      value={formData.nombreCompleto}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="telefono">Teléfono</Label>
                    </div>
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <Input
                      id="email"
                      name="email"
                      value={perfil?.email || ""}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">El email no se puede modificar</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>
                Actualiza tu contraseña para mantener tu cuenta segura
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="currentPassword">Contraseña actual</Label>
                    </div>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="newPassword">Nueva contraseña</Label>
                    </div>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    {passwordError && (
                      <p className="text-xs text-red-500">{passwordError}</p>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Eliminar Cuenta</CardTitle>
              <CardDescription>
                Esta acción es permanente y no se puede deshacer. Todos tus datos serán eliminados.
              </CardDescription>
            </CardHeader>            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Eliminar cuenta</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Estás seguro?</DialogTitle>
                    <DialogDescription>
                      Esta acción eliminará permanentemente tu cuenta y todos los datos asociados a ella, incluyendo vehículos y reservas. Esta acción no se puede deshacer.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex justify-between sm:justify-between">
                    <Button variant="outline" onClick={() => document.querySelector('[data-radix-dialog-close]').click()}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                      Eliminar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Perfil