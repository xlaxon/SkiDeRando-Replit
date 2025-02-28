import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Mountain } from "lucide-react";

export default function AuthPage() {
  const [, navigate] = useLocation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 p-4">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <Mountain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">SkiTourSpots</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            Découvrez et partagez les meilleurs spots de ski de randonnée avec la communauté.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 p-2">🗺️</span>
              <span>Cartographie interactive détaillée</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 p-2">📝</span>
              <span>Rapports de sortie complets avec traces GPS</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 p-2">👥</span>
              <span>Communauté active de passionnés</span>
            </li>
          </ul>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Bienvenue</CardTitle>
              <CardDescription>
                Connectez-vous ou créez un compte pour accéder à toutes les fonctionnalités
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="register">Inscription</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm onSuccess={() => navigate("/")} />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm onSuccess={() => navigate("/")} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
