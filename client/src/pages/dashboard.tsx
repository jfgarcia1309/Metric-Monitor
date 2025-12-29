import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Users, 
  Phone, 
  Clock, 
  Target, 
  Star,
  Activity,
  Calendar,
  Download,
  CheckCircle,
  AlertCircle,
  Zap,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Gestor {
  nombre: string;
  renovaciones: number;
  calidad: number;
  atrasos: number;
  llamadas: number;
  conectividad: number;
}

const CircularProgress = ({ value, max, label, color, sublabel }: { value: number; max: number; label: string; color: string; sublabel?: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className="relative w-32 h-32 transition-transform duration-300 group-hover:scale-105">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/30" />
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="64" cy="64" r={radius} 
            stroke={color} 
            strokeWidth="8" 
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tracking-tighter" style={{ color: color }}>{value}</span>
          <span className="text-xs text-muted-foreground font-medium">{percentage.toFixed(0)}%</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-foreground mt-3">{label}</p>
      {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
    </div>
  );
};

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAllGestores, setShowAllGestores] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(4);
  const [, navigate] = useLocation();
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Datos por semana (lee de localStorage si está disponible)
  const getWeeklyData = (week: number) => {
    const savedData = localStorage.getItem('gestores_data');
    const baseData = savedData ? JSON.parse(savedData) : [
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

    // Variación semanal realista (solo si no hay datos personalizados)
    if (!savedData) {
      const variations = [
        { factor: 0.85, calidad: -3 },
        { factor: 0.90, calidad: -1 },
        { factor: 0.95, calidad: 1 },
        { factor: 1.0, calidad: 2 }
      ];
      const v = variations[week - 1] || variations[3];
      return baseData.map((g) => ({
        ...g,
        renovaciones: Math.round((g as Gestor).renovaciones * v.factor),
        calidad: Math.min((g as Gestor).calidad + v.calidad, 95),
        atrasos: Math.max((g as Gestor).atrasos + (v.factor < 1 ? 0.3 : -0.1), 0.2)
      }));
    }
    return baseData;
  };

  const handleExport = () => {
    const csv = [
      ['Gestor', 'Renovaciones', 'Calidad', 'Atrasos', 'Llamadas'].join(','),
      ...gestores.map(g => [g.nombre, g.renovaciones, g.calidad, g.atrasos, g.llamadas].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renovaciones-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const gestores = getWeeklyData(currentWeek);

  const meta = 180;
  const totalRenovaciones = gestores.reduce((sum: number, g: Gestor) => sum + g.renovaciones, 0);
  const promedioCalidad = (gestores.reduce((sum: number, g: Gestor) => sum + g.calidad, 0) / gestores.length).toFixed(1);
  const promedioAtrasos = (gestores.reduce((sum: number, g: Gestor) => sum + g.atrasos, 0) / gestores.length).toFixed(2);
  const promedioLlamadas = Math.round(gestores.reduce((sum: number, g: Gestor) => sum + g.llamadas, 0) / gestores.length);
  const metaTotal = meta * gestores.length;
  
  // Top performers
  const sortedByRenovaciones = [...gestores].sort((a, b) => b.renovaciones - a.renovaciones);
  const mejorRenovaciones = sortedByRenovaciones[0];
  const mejorCalidad = [...gestores].sort((a, b) => b.calidad - a.calidad)[0];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Renovaciones</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">{currentTime.toLocaleTimeString('es-CO')}</span>
              <span className="text-xs text-muted-foreground">{currentTime.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/admin')}
              className="hidden md:flex"
              data-testid="button-admin-panel"
            >
              <Settings className="mr-2 h-4 w-4" />
              Admin
            </Button>
            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Competencia Sana - Semana {currentWeek}</h2>
            <p className="text-muted-foreground mt-1">Ranking semanal | KPIs: 180+ renovaciones/mes | Calidad {'>'}80% | Atrasos ≤2%</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {[1, 2, 3, 4].map((w: number) => (
                <Button
                  key={w}
                  variant={currentWeek === w ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentWeek(w)}
                  className="w-10"
                  data-testid={`button-week-${w}`}
                >
                  S{w}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} data-testid="button-export">
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
          </div>
        </div>

        {/* Estrategia para Alcanzar Meta */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Estrategia: Cómo Alcanzar la Meta con 23 Gestores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Meta Total</h4>
                  <p className="text-sm text-muted-foreground">23 gestores × 180 renovaciones = <strong>4,140 renovaciones/mes</strong></p>
                  <p className="text-xs text-muted-foreground mt-2">↓ 138 renovaciones/día (promedio)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Distribución Realista</h4>
                  <p className="text-sm text-muted-foreground">Equipo está <strong>+11.2% por encima</strong> de meta (4,340 renovaciones gestionadas)</p>
                  <p className="text-xs text-muted-foreground mt-2">8 gestores superan meta en +15%</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Indicadores Cumplidos</h4>
                  <p className="text-sm text-muted-foreground"><strong>✓</strong> Calidad: {promedioCalidad}% (meta: 80%)</p>
                  <p className="text-sm text-muted-foreground"><strong>✓</strong> Atrasos: {promedioAtrasos}% (límite: 2%)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main KPI Card */}
          <Card className="md:col-span-2 overflow-hidden relative border-none shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Target className="w-64 h-64 text-primary transform rotate-12 translate-x-12 -translate-y-12" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="w-5 h-5 text-primary" />
                Totales Por Canal
              </CardTitle>
              <CardDescription>Progreso actual vs Metas mensuales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-around items-center gap-8 py-4">
                <CircularProgress value={totalRenovaciones} max={metaTotal} label="Total Renovaciones" color="hsl(var(--primary))" sublabel={`Meta: ${metaTotal}`} />
                <CircularProgress value={Math.min(mejorRenovaciones.renovaciones, 180)} max={180} label="Mejor Efectividad" color="hsl(var(--chart-2))" sublabel="Meta Individual: 180" />
                <CircularProgress value={parseFloat(promedioCalidad)} max={100} label="Calidad Promedio" color="hsl(var(--chart-3))" sublabel="Meta: >80%" />
              </div>
            </CardContent>
          </Card>

          {/* Top Performer Card */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <CardHeader className="relative z-10 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Star className="w-5 h-5 fill-white text-white" />
                  Gestor del Mes
                </CardTitle>
                <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                  #1 Ranking
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-col items-center text-center mt-4">
                <div className="w-24 h-24 rounded-full border-4 border-white/30 bg-white/10 flex items-center justify-center text-3xl font-bold mb-4 shadow-xl backdrop-blur-sm">
                  {mejorRenovaciones.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <h3 className="text-xl font-bold leading-tight mb-1">{mejorRenovaciones.nombre}</h3>
                <p className="text-white/80 text-sm mb-6">Top Performer en Renovaciones</p>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                    <div className="text-2xl font-bold">{mejorRenovaciones.renovaciones}</div>
                    <div className="text-xs text-white/70 uppercase tracking-wider font-medium">Renovaciones</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                    <div className="text-2xl font-bold">{mejorRenovaciones.calidad}%</div>
                    <div className="text-xs text-white/70 uppercase tracking-wider font-medium">Calidad</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Gestores</p>
                <h3 className="text-2xl font-bold">{gestores.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Calidad Promedio</p>
                <h3 className="text-2xl font-bold">{promedioCalidad}%</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 ${parseFloat(promedioAtrasos) <= 2 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} rounded-xl`}>
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Media Atrasos</p>
                <h3 className="text-2xl font-bold">{promedioAtrasos}%</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Meta por Gestor</p>
                <h3 className="text-2xl font-bold">180+</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Table */}
          <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Rendimiento por Gestor</CardTitle>
                <CardDescription>Detalle de métricas individuales ordenado por renovaciones.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport} data-testid="button-export-table">
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[250px]">Gestor</TableHead>
                      <TableHead className="text-center">Renovaciones</TableHead>
                      <TableHead className="text-center">Progreso</TableHead>
                      <TableHead className="text-center">Calidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedByRenovaciones.slice(0, showAllGestores ? undefined : 10).map((gestor, i) => {
                       const porcentaje = (gestor.renovaciones / meta) * 100;
                       return (
                        <TableRow key={i} data-testid={`row-gestor-${i}`}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                {gestor.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                              </div>
                              <span className="truncate max-w-[180px]" title={gestor.nombre}>{gestor.nombre}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-bold text-base" data-testid={`text-renovaciones-${i}`}>{gestor.renovaciones}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 justify-center">
                              <Progress 
                                value={porcentaje} 
                                className="w-[60px] h-2" 
                                indicatorClassName={
                                  porcentaje >= 80 ? "bg-green-500" : 
                                  porcentaje >= 60 ? "bg-amber-500" : "bg-red-500"
                                }
                              />
                              <span className="text-xs text-muted-foreground w-8 text-right">{porcentaje.toFixed(0)}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={gestor.calidad >= 80 ? "outline" : "secondary"} className={gestor.calidad >= 80 ? "text-green-600 border-green-200 bg-green-50" : ""}>
                              {gestor.calidad}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                       );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setShowAllGestores(!showAllGestores)}
                  data-testid="button-toggle-all-gestores"
                >
                  {showAllGestores ? '↑ Ver Top 10' : '↓ Ver todos los gestores'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Side Widgets */}
          <div className="space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Calidad vs Meta</CardTitle>
                <CardDescription>Top 5 Calidad este mes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {gestores.sort((a: Gestor, b: Gestor) => b.calidad - a.calidad).slice(0, 5).map((gestor: Gestor, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-4">{i + 1}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium truncate max-w-[140px]">{gestor.nombre}</span>
                        <span className="text-xs text-muted-foreground">Renovaciones: {gestor.renovaciones}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-green-600">{gestor.calidad}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Productividad</h3>
                  <TrendingUp className="w-5 h-5 opacity-80" />
                </div>
                <div className="text-4xl font-bold mb-1">+12.5%</div>
                <p className="text-primary-foreground/80 text-sm mb-6">Incremento en renovaciones vs mes anterior</p>
                <div className="h-1 bg-white/20 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-white w-[75%] rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
