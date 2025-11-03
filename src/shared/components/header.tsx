import { ModeToggle } from "@/components/ui/toggle-theme";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 rounded-4xl fixed top-4 w-full bg-background z-50 border">
      <Link href="/">
        <h2 className="text-2xl font-bold">TaskCenter</h2>
      </Link>
      <ModeToggle />
    </header>
  );
};

export { Header };
