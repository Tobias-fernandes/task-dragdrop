import { ModeToggle } from "@/components/ui/toggle-theme";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4">
      <Link href="/">
        <h2 className="text-2xl font-bold">TaskCenter</h2>
      </Link>
      <ModeToggle />
    </header>
  );
};

export { Header };
