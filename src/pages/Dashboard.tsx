import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { GymCard } from "@/components/GymCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock as ClockIcon, Target, Flame, Droplets, Zap, Plus, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Clock } from "@/components/Clock";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sb } from "@/integrations/supabase/untyped";
import { useMotivationalMessage } from "@/hooks/useMotivationalMessage";

const Dashboard = () => {
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>('');
  const motivationalMessage = useMotivationalMessage();
  
  useEffect(() => {
    const loadUserName = async () => {
      if (!user) return;

      const { data: profile, error } = await sb
        .from('profiles')
        .select('name')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Profile data:', profile, 'Error:', error);

      if (profile?.name) {
        let firstName = profile.name.trim();
        
        // Se for email, pegar parte antes do @ e remover caracteres especiais
        if (firstName.includes('@')) {
          firstName = firstName.split('@')[0].replace(/[.+]/g, ' ');
        }
        
        // Pegar apenas primeiro nome se houver espaços
        firstName = firstName.split(' ')[0];
        
        // Capitalizar primeira letra de cada palavra
        firstName = firstName
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        setUserName(firstName);
      } else {
        setUserName('Amigo');
      }
    };

    loadUserName();
  }, [user]);

  const todayStats = [
    { icon: <Flame className="w-6 h-6" />, title: "Calorias Queimadas", value: "420", change: "+15%", variant: "fitness" as const },
    { icon: <Droplets className="w-6 h-6" />, title: "Água Consumida", value: "1.8L", change: "+5%", variant: "default" as const },
    { icon: <Target className="w-6 h-6" />, title: "Meta de Proteína", value: "85g", change: "+12%", variant: "nutrition" as const },
    { icon: <ClockIcon className="w-6 h-6" />, title: "Tempo de Treino", value: "45min", variant: "fitness" as const },
  ];

  return (
    <Layout>
      <div className="p-4 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-3xl font-bold">Olá, {userName}! 👋</h1>
              <div className="md:hidden">
                <ThemeSelector />
              </div>
            </div>
            <p className="motivational-text text-primary font-medium">{motivationalMessage}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Clock />
            <div className="flex gap-2">
              <Link to="/workouts">
                <Button variant="fitness" size="sm">
                  <Plus className="w-4 h-4" />
                  Novo Treino
                </Button>
              </Link>
              <Link to="/nutrition">
                <Button variant="nutrition" size="sm">
                  <Plus className="w-4 h-4" />
                  Analisar Refeição
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {todayStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Workout */}
          <GymCard 
            variant="fitness"
            title="Treino de Hoje"
            description="Peito e Tríceps - Hipertrofia"
            className="lg:col-span-2"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progresso</span>
                <span className="text-sm font-medium">3/5 exercícios</span>
              </div>
              <Progress value={60} className="h-2" />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-fitness-subtle">
                  <div>
                    <p className="font-medium">Supino reto com barra</p>
                    <p className="text-sm text-muted-foreground">3x12 - 70kg</p>
                  </div>
                  <div className="text-green-500 text-xl">✓</div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-fitness-subtle">
                  <div>
                    <p className="font-medium">Supino inclinado</p>
                    <p className="text-sm text-muted-foreground">3x10 - 60kg</p>
                  </div>
                  <div className="text-green-500 text-xl">✓</div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border border-primary/20">
                  <div>
                    <p className="font-medium text-primary">Crucifixo com halteres</p>
                    <p className="text-sm text-muted-foreground">3x12 - 20kg</p>
                  </div>
                  <div className="text-primary">⏳</div>
                </div>
              </div>
              
              <Link to="/workouts">
                <Button variant="fitness" className="w-full">
                  <Zap className="w-4 h-4" />
                  Continuar Treino
                </Button>
              </Link>
            </div>
          </GymCard>

          {/* Nutrition Summary */}
          <GymCard 
            variant="nutrition"
            title="Resumo Nutricional"
            description="Objetivo: 2.200 kcal"
          >
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">1.640</div>
                <div className="text-sm text-muted-foreground">kcal consumidas</div>
                <div className="text-xs text-green-500 mt-1">560 kcal restantes</div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Carboidratos</span>
                    <span>180g / 220g</span>
                  </div>
                  <Progress value={82} className="h-1" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Proteínas</span>
                    <span>85g / 120g</span>
                  </div>
                  <Progress value={71} className="h-1" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Gorduras</span>
                    <span>45g / 60g</span>
                  </div>
                  <Progress value={75} className="h-1" />
                </div>
              </div>
              
              <Link to="/nutrition">
                <Button variant="nutrition" className="w-full">
                  <Plus className="w-4 h-4" />
                  Adicionar Refeição
                </Button>
              </Link>
            </div>
          </GymCard>
        </div>

        {/* Weekly Progress */}
        <GymCard 
          title="Progresso Semanal"
          description="Sua evolução nos últimos 7 dias"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-gradient-fitness-subtle">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">Treinos Completos</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gradient-nutrition-subtle">
              <Target className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary">92%</div>
              <div className="text-sm text-muted-foreground">Meta Calórica</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-muted">
              <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <div className="text-2xl font-bold">7</div>
              <div className="text-sm text-muted-foreground">Dias Consecutivos</div>
            </div>
          </div>
        </GymCard>
      </div>
    </Layout>
  );
};

export default Dashboard;