import { Link } from "wouter";
import { Mountain, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function NavHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary/5 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
          <Mountain className="h-6 w-6" />
          <span className="font-semibold text-lg">SkiTourSpots</span>
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/add-spot" className="text-sm font-medium hover:text-primary">
                Ajouter un spot
              </Link>
              <Link href={`/users/${user.username}`} className="flex items-center gap-1 text-sm font-medium hover:text-primary">
                <User className="h-4 w-4" />
                {user.username}
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout()} className="flex items-center gap-1">
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                Connexion
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}