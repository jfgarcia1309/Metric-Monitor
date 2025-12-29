import React, { useState } from 'react';
import { Upload, Save, Plus, Trash2, DownloadCloud, Lock, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Manager, InsertManager } from '@shared/schema';

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [currentWeek, setCurrentWeek] = useState(4);
  const [, navigate] = useLocation();

  const [gestoresList, setGestoresList] = useState<Manager[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Manager | null>(null);

  const { data: managers = [] } = useQuery<Manager[]>({
    queryKey: ['/api/managers/week', currentWeek],
    queryFn: async () => {
      const res = await fetch(`/api/managers/week/${currentWeek}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });

  const mutation = useMutation({
    mutationFn: async (newManager: InsertManager) => {
      const res = await apiRequest('POST', '/api/managers', newManager, {
        headers: { 'x-admin-password': password }
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/managers/week', currentWeek] });
      toast.success('✅ Gestor añadido exitosamente');
    },
    onError: () => {
      toast.error('Error al añadir gestor. Verifica la contraseña.');
    }
  });

  const [newGestor, setNewGestor] = useState<InsertManager>({
    nombre: '',
    renovaciones: 0,
    calidad: 0,
    atrasos: 0,
    llamadas: 0,
    conectividad: 70,
    semana: currentWeek
  });

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAdmin(true);
      toast.success('Acceso concedido');
    } else {
      toast.error('Contraseña incorrecta');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Acceso Administrativo</CardTitle>
            <CardDescription>Ingresa la contraseña para continuar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button className="w-full" onClick={handleLogin}>Entrar</Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/')}>Volver al Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    toast.success('✅ Los datos se guardan automáticamente en el servidor');
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(l => l.trim());
        
        let count = 0;
        for (let i = 1; i < lines.length; i++) {
          const [nombre, renovaciones, calidad, atrasos, llamadas] = lines[i].split(',').map(v => v.trim());
          if (nombre) {
            await apiRequest('POST', '/api/managers', {
              nombre,
              renovaciones: parseInt(renovaciones) || 0,
              calidad: parseInt(calidad) || 0,
              atrasos: parseFloat(atrasos) || 0,
              llamadas: parseInt(llamadas) || 0,
              conectividad: 70,
              semana: currentWeek
            }, {
              headers: { 'x-admin-password': password }
            });
            count++;
          }
        }

        if (count > 0) {
          queryClient.invalidateQueries({ queryKey: ['/api/managers/week', currentWeek] });
          toast.success(`✅ Importados ${count} gestores`);
        } else {
          toast.error('No se encontraron datos válidos');
        }
      } catch (err) {
        toast.error('Error al procesar CSV');
      }
    };
    reader.readAsText(file);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValues({ ...managers[index] });
  };

  const handleSaveEdit = async () => {
    if (editingIndex !== null && editValues) {
      try {
        await apiRequest('PATCH', `/api/managers/${editValues.id}`, editValues, {
          headers: { 'x-admin-password': password }
        });
        queryClient.invalidateQueries({ queryKey: ['/api/managers/week', currentWeek] });
        setEditingIndex(null);
        setEditValues(null);
        toast.success('Gestor actualizado');
      } catch (e) {
        toast.error('Error al actualizar');
      }
    }
  };

  const handleDelete = async (index: number) => {
    const gestor = managers[index];
    try {
      await apiRequest('DELETE', `/api/managers/${gestor.id}`, undefined, {
        headers: { 'x-admin-password': password }
      });
      queryClient.invalidateQueries({ queryKey: ['/api/managers/week', currentWeek] });
      toast.success('Gestor eliminado');
    } catch (e) {
      toast.error('Error al eliminar');
    }
  };

  const handleAddGestor = () => {
    if (!newGestor.nombre) {
      toast.error('El nombre es requerido');
      return;
    }
    mutation.mutate({ ...newGestor, semana: currentWeek });
    setNewGestor({ nombre: '', renovaciones: 0, calidad: 0, atrasos: 0, llamadas: 0, conectividad: 70, semana: currentWeek });
  };

  const handleDownloadTemplate = () => {
    const csv = [
      ['Gestor', 'Renovaciones', 'Calidad', 'Atrasos', 'Llamadas'].join(','),
      ...managers.map(g => [g.nombre, g.renovaciones, g.calidad, g.atrasos, g.llamadas].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-gestores.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Admin - Gestión de Datos</h1>
          </div>
          <Badge variant="destructive">🔐 Solo Admin</Badge>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4].map(w => (
            <Button 
              key={w}
              variant={currentWeek === w ? "default" : "outline"}
              onClick={() => setCurrentWeek(w)}
            >
              Semana {w}
            </Button>
          ))}
        </div>
        {/* Opciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-600" />
                Opción 1
              </CardTitle>
              <CardDescription>Agregar Manual</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Completa el formulario abajo y haz clic en "Agregar Gestor"
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Opción 2
              </CardTitle>
              <CardDescription>Importar CSV</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Carga un archivo CSV con todos los datos de una vez
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DownloadCloud className="w-5 h-5 text-purple-600" />
                Opción 3
              </CardTitle>
              <CardDescription>Descargar Template</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Obtén el formato correcto para el CSV
            </CardContent>
          </Card>
        </div>

        {/* Acciones Rápidas */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle>Importar / Exportar Datos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild className="cursor-pointer">
              <label className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                📤 Importar CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVImport}
                  className="hidden"
                  data-testid="input-csv-import"
                />
              </label>
            </Button>
            <Button variant="outline" onClick={handleDownloadTemplate} data-testid="button-download-template">
              <DownloadCloud className="mr-2 h-4 w-4" />
              📥 Descargar Template
            </Button>
            <Button onClick={handleSave} className="ml-auto bg-green-600 hover:bg-green-700" data-testid="button-save-data">
              <Save className="mr-2 h-4 w-4" />
              ✅ Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Agregar Nuevo Gestor */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle>➕ Agregar Nuevo Gestor</CardTitle>
            <CardDescription>Completa los datos y haz clic en "Agregar"</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  placeholder="Ej: Juan Pérez"
                  value={newGestor.nombre}
                  onChange={(e) => setNewGestor({ ...newGestor, nombre: e.target.value })}
                  data-testid="input-new-nombre"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Renovaciones</label>
                <Input
                  type="number"
                  placeholder="Ej: 190"
                  value={newGestor.renovaciones}
                  onChange={(e) => setNewGestor({ ...newGestor, renovaciones: parseInt(e.target.value) })}
                  data-testid="input-new-renovaciones"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Calidad %</label>
                <Input
                  type="number"
                  placeholder="Ej: 85"
                  value={newGestor.calidad}
                  onChange={(e) => setNewGestor({ ...newGestor, calidad: parseInt(e.target.value) })}
                  data-testid="input-new-calidad"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Atrasos %</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ej: 1.5"
                  value={newGestor.atrasos}
                  onChange={(e) => setNewGestor({ ...newGestor, atrasos: parseFloat(e.target.value) })}
                  data-testid="input-new-atrasos"
                />
              </div>
              <Button 
                onClick={handleAddGestor}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-add-gestor"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabla Editable */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Gestores ({managers.length})</CardTitle>
            <CardDescription>Edita los datos directamente o importa desde CSV</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Gestor</TableHead>
                    <TableHead className="text-center">Renovaciones</TableHead>
                    <TableHead className="text-center">Calidad</TableHead>
                    <TableHead className="text-center">Atrasos</TableHead>
                    <TableHead className="text-center">Llamadas</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
            <TableBody>
              {managers.map((gestor, idx) => (
                <TableRow key={gestor.id}>
                  {editingIndex === idx && editValues ? (
                        <>
                          <TableCell>
                            <Input
                              value={editValues.nombre}
                              onChange={(e) => setEditValues({ ...editValues, nombre: e.target.value })}
                              className="text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editValues.renovaciones}
                              onChange={(e) => setEditValues({ ...editValues, renovaciones: parseInt(e.target.value) })}
                              className="text-center text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editValues.calidad}
                              onChange={(e) => setEditValues({ ...editValues, calidad: parseInt(e.target.value) })}
                              className="text-center text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.1"
                              value={editValues.atrasos}
                              onChange={(e) => setEditValues({ ...editValues, atrasos: parseFloat(e.target.value) })}
                              className="text-center text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editValues.llamadas}
                              onChange={(e) => setEditValues({ ...editValues, llamadas: parseInt(e.target.value) })}
                              className="text-center text-sm"
                            />
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button size="sm" onClick={handleSaveEdit} data-testid={`button-confirm-${idx}`}>
                              ✓
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)}>
                              ✕
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium">{gestor.nombre}</TableCell>
                          <TableCell className="text-center font-bold">{gestor.renovaciones}</TableCell>
                          <TableCell className="text-center">{gestor.calidad}%</TableCell>
                          <TableCell className="text-center">{gestor.atrasos}%</TableCell>
                          <TableCell className="text-center">{gestor.llamadas}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(idx)}
                              data-testid={`button-edit-${idx}`}
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(idx)}
                              data-testid={`button-delete-${idx}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">📋 Instrucciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-foreground">1️⃣ Agregar Manual:</p>
                <p className="text-muted-foreground">Completa el formulario verde arriba y haz clic en "Agregar"</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">2️⃣ Importar CSV:</p>
                <p className="text-muted-foreground">Haz clic en "Importar CSV" y selecciona tu archivo</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">3️⃣ Editar Existentes:</p>
                <p className="text-muted-foreground">Haz clic en "Editar" en cualquier fila</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">4️⃣ Guardar:</p>
                <p className="text-muted-foreground">Haz clic en <strong>"Guardar Cambios"</strong> (botón verde)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-lg">📄 Formato CSV</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="font-mono bg-white p-2 rounded border text-xs">
                Gestor,Renovaciones,Calidad,Atrasos,Llamadas
              </p>
              <p className="font-mono bg-white p-2 rounded border text-xs">
                Monica Perez,195,84,1.2,52
              </p>
              <p className="font-mono bg-white p-2 rounded border text-xs">
                Juan Gomez,188,82,1.5,48
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                💾 Los datos se guardan en el servidor y aparecen en el dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
