import { ModeToggle } from "@/components/ui/toggle-theme";
import Link from "next/link";

const Header = () => {
  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 backdrop-blur-md bg-background/70 border border-border shadow-md rounded-2xl px-6 py-3 w-[90%] max-w-4xl transition-all duration-300">
      <nav className="flex justify-between items-center">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h2 className="text-2xl font-bold tracking-tight">TaskCenter</h2>
        </Link>
        <ModeToggle />
      </nav>
    </header>
  );
};

export { Header };
