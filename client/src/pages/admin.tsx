import React, { useState, useEffect } from 'react';
import { Upload, Save, Plus, Trash2, DownloadCloud, Lock } from 'lucide-react';
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

interface Gestor {
  nombre: string;
  renovaciones: number;
  calidad: number;
  atrasos: number;
  llamadas: number;
  conectividad: number;
}

const DEFAULT_GESTORES: Gestor[] = [
  { nombre: "Monica Andrea Perez Pardo", renovaciones: 195, calidad: 84, atrasos: 1.2, llamadas: 52, conectividad: 68 },
  { nombre: "Leidy Yolima Castro Rojas", renovaciones: 188, calidad: 82, atrasos: 1.5, llamadas: 48, conectividad: 65 },
  { nombre: "Laura Alejandra Cañas Prieto", renovaciones: 192, calidad: 86, atrasos: 0.8, llamadas: 55, conectividad: 72 },
  { nombre: "Tatiana Paola Rosas Munevar", renovaciones: 185, calidad: 81, atrasos: 1.8, llamadas: 42, conectividad: 58 },
  { nombre: "Lina Tatiana Bogota Murcia", renovaciones: 191, calidad: 83, atrasos: 1.3, llamadas: 50, conectividad: 67 },
  { nombre: "Ingrid Marcela Peña Buitrago", renovaciones: 186, calidad: 80, atrasos: 1.9, llamadas: 46, conectividad: 62 },
  { nombre: "Fernanda Romero Saenz", renovaciones: 194, calidad: 85, atrasos: 0.9, llamadas: 53, conectividad: 70 },
  { nombre: "Andrea Lievano Gomez", renovaciones: 182, calidad: 79, atrasos: 1.7, llamadas: 44, conectividad: 60 },
  { nombre: "Luz Mary Pinto Alarcon", renovaciones: 198, calidad: 88, atrasos: 0.5, llamadas: 58, conectividad: 75 },
  { nombre: "Gloria Estefani Gomez Plata", renovaciones: 180, calidad: 78, atrasos: 1.9, llamadas: 40, conectividad: 55 },
  { nombre: "Monica Alexandra Rey Munevar", renovaciones: 189, calidad: 82, atrasos: 1.4, llamadas: 49, conectividad: 66 },
  { nombre: "Maria Elena Vanegas Silguero", renovaciones: 196, calidad: 87, atrasos: 0.7, llamadas: 54, conectividad: 71 },
  { nombre: "Yina Sanchez Roa", renovaciones: 187, calidad: 81, atrasos: 1.6, llamadas: 47, conectividad: 63 },
  { nombre: "Manuel David Casas Orjuela", renovaciones: 190, calidad: 84, atrasos: 1.1, llamadas: 51, conectividad: 68 },
  { nombre: "Juan David Perez Moreno", renovaciones: 183, calidad: 80, atrasos: 1.8, llamadas: 43, conectividad: 59 },
  { nombre: "Angelica Natalia Rodriguez Prieto", renovaciones: 199, calidad: 89, atrasos: 0.4, llamadas: 56, conectividad: 74 },
  { nombre: "Jessica Tatiana Valderrama Roa", renovaciones: 184, calidad: 81, atrasos: 1.7, llamadas: 45, conectividad: 61 },
  { nombre: "Daniela Ramirez Pacheco", renovaciones: 188, calidad: 83, atrasos: 1.2, llamadas: 50, conectividad: 67 },
  { nombre: "John Erick Jaramillo Correa", renovaciones: 181, calidad: 79, atrasos: 1.9, llamadas: 41, conectividad: 56 },
  { nombre: "Karolina Arboleda Rios", renovaciones: 197, calidad: 86, atrasos: 0.6, llamadas: 57, conectividad: 73 },
  { nombre: "Alisson Mora Benavidez", renovaciones: 189, calidad: 82, atrasos: 1.4, llamadas: 48, conectividad: 65 },
  { nombre: "Paula Andrea Gomez Bernal", renovaciones: 193, calidad: 84, atrasos: 1.0, llamadas: 52, conectividad: 69 },
  { nombre: "Leidy Juliana Santander Roa", renovaciones: 186, calidad: 80, atrasos: 1.8, llamadas: 46, conectividad: 62 }
];

export default function AdminPanel() {
  const [gestores, setGestores] = useState<Gestor[]>(DEFAULT_GESTORES);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Gestor | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('gestores_data');
    if (saved) {
      try {
        setGestores(JSON.parse(saved));
        toast.success('Datos cargados desde localStorage');
      } catch (e) {
        toast.error('Error al cargar datos');
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('gestores_data', JSON.stringify(gestores));
    toast.success('✅ Datos guardados exitosamente');
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(l => l.trim());
        const data: Gestor[] = [];

        for (let i = 1; i < lines.length; i++) {
          const [nombre, renovaciones, calidad, atrasos, llamadas] = lines[i].split(',').map(v => v.trim());
          if (nombre) {
            data.push({
              nombre,
              renovaciones: parseInt(renovaciones) || 0,
              calidad: parseInt(calidad) || 0,
              atrasos: parseFloat(atrasos) || 0,
              llamadas: parseInt(llamadas) || 0,
              conectividad: 70
            });
          }
        }

        if (data.length > 0) {
          setGestores(data);
          toast.success(`✅ Importados ${data.length} gestores`);
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
    setEditValues({ ...gestores[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editValues) {
      const updated = [...gestores];
      updated[editingIndex] = editValues;
      setGestores(updated);
      setEditingIndex(null);
      setEditValues(null);
      toast.success('Gestor actualizado');
    }
  };

  const handleDelete = (index: number) => {
    setGestores(gestores.filter((_, i) => i !== index));
    toast.success('Gestor eliminado');
  };

  const handleDownloadTemplate = () => {
    const csv = [
      ['Gestor', 'Renovaciones', 'Calidad', 'Atrasos', 'Llamadas'].join(','),
      ...gestores.map(g => [g.nombre, g.renovaciones, g.calidad, g.atrasos, g.llamadas].join(','))
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
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Admin - Gestión de Datos</h1>
          </div>
          <Badge variant="destructive">Solo Admin</Badge>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Importar / Exportar Datos</CardTitle>
            <CardDescription>Carga un CSV o descarga el template actual</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild className="cursor-pointer">
              <label className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Importar CSV
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
              Descargar Template
            </Button>
            <Button onClick={handleSave} className="ml-auto" data-testid="button-save-data">
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Tabla Editable */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Gestores ({gestores.length})</CardTitle>
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
                  {gestores.map((gestor, idx) => (
                    <TableRow key={idx}>
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
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              💾 Los cambios se guardan en localStorage (navegador). Haz clic en <strong>"Guardar Cambios"</strong> después de editar.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              📋 Formato CSV esperado: Gestor,Renovaciones,Calidad,Atrasos,Llamadas
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
