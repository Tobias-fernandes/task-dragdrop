import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="font-extrabold text-7xl">Hello, World!</h1>
      <Button size={"lg"} asChild>
        <Link href="/dragdrop">Access your tasks</Link>
      </Button>
    </div>
  );
};

export default Home;
