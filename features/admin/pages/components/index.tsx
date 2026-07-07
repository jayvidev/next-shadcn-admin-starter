'use client'

import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle2,
  CreditCard,
  Info,
  Mail,
  Settings,
  User,
  XCircle,
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export default function ComponentsPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 mt-2">
      {/* Grid de componentes principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Card de Botones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Botones
            </CardTitle>
            <CardDescription>Diferentes variantes de botones disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Primario</Button>
              <Button variant="outline" size="sm">
                Secundario
              </Button>
              <Button variant="link" size="sm">
                Enlace
              </Button>
              <Button variant="ghost" size="sm">
                Fantasma
              </Button>
              <Button variant="destructive" size="sm">
                Peligro
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card de Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="h-5 w-5" />
              Badges
            </CardTitle>
            <CardDescription>Estados y etiquetas visuales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>Primario</Badge>
              <Badge variant="secondary">Secundario</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Peligro</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card de Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progreso
            </CardTitle>
            <CardDescription>Barras de progreso y métricas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Completado</span>
                  <span>75%</span>
                </div>
                <Progress value={75} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>En progreso</span>
                  <span>45%</span>
                </div>
                <Progress value={45} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario más completo */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Formulario de Contacto
          </CardTitle>
          <CardDescription>Ejemplo de formulario con diferentes tipos de inputs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input id="nombre" placeholder="Juan Pérez" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="ejemplo@correo.com" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" type="tel" placeholder="+51 999 999 999" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pais">País</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un país" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pe">Perú</SelectItem>
                    <SelectItem value="co">Colombia</SelectItem>
                    <SelectItem value="mx">México</SelectItem>
                    <SelectItem value="es">España</SelectItem>
                    <SelectItem value="ar">Argentina</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="mensaje">Mensaje</Label>
                <Textarea
                  id="mensaje"
                  placeholder="Escribe tu mensaje aquí..."
                  className="min-h-25"
                />
              </div>

              <div className="grid gap-2">
                <Label>Tipo de consulta</Label>
                <RadioGroup defaultValue="general">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="general" />
                    <Label htmlFor="general">Consulta general</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="soporte" id="soporte" />
                    <Label htmlFor="soporte">Soporte técnico</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ventas" id="ventas" />
                    <Label htmlFor="ventas">Ventas</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" />
                  <Label htmlFor="newsletter">Suscribirse al newsletter</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="notificaciones" />
                  <Label htmlFor="notificaciones">Recibir notificaciones</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">Cancelar</Button>
            <Button>Enviar mensaje</Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts y estados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas y Estados
            </CardTitle>
            <CardDescription>Diferentes tipos de mensajes de estado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Información</AlertTitle>
                <AlertDescription>Este es un mensaje informativo para el usuario.</AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Ha ocurrido un error. Por favor intenta nuevamente.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Éxito</AlertTitle>
                <AlertDescription>La operación se completó correctamente.</AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Card de estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Estadísticas
            </CardTitle>
            <CardDescription>Métricas y datos importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Usuarios activos</span>
                </div>
                <Badge>1,234</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Mensajes enviados</span>
                </div>
                <Badge variant="secondary">567</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Eventos</span>
                </div>
                <Badge variant="outline">89</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Ventas</span>
                </div>
                <Badge variant="destructive">$12,345</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
