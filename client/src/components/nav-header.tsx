import { Link } from "wouter";
import { Mountain } from "lucide-react";

export function NavHeader() {
  return (
    <header className="bg-primary/5 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 text-primary hover:text-primary/80">
            <Mountain className="h-6 w-6" />
            <span className="font-semibold text-lg">SkiTourSpots</span>
          </a>
        </Link>
        <nav>
          <Link href="/add-spot">
            <a className="text-sm font-medium hover:text-primary">Add New Spot</a>
          </Link>
        </nav>
      </div>
    </header>
  );
}
