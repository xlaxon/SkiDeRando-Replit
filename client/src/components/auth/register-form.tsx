import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import type { InsertUser } from "@shared/schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef } from "react";

type RegisterFormProps = {
  onSuccess: () => void;
};

// Étend le schéma d'insertion pour inclure le token captcha
const registerSchema = insertUserSchema.extend({
  captchaToken: z.string().min(1, "Veuillez compléter le captcha"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { toast } = useToast();
  const captchaRef = useRef<HCaptcha>(null);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      captchaToken: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const res = await apiRequest("POST", "/api/auth/register", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur SkiTourSpots !",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      });
      captchaRef.current?.resetCaptcha();
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom d'utilisateur</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="captchaToken"
          render={() => (
            <FormItem>
              <FormControl>
                <HCaptcha
                  ref={captchaRef}
                  sitekey={process.env.VITE_HCAPTCHA_SITE_KEY!}
                  onVerify={(token) => form.setValue("captchaToken", token)}
                  onExpire={() => form.setValue("captchaToken", "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Inscription..." : "S'inscrire"}
        </Button>
      </form>
    </Form>
  );
}