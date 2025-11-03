import { Button } from "@/components/ui/button";
import Link from "next/link";

const handleGoodMorning = () => {
  const hours = new Date().getHours();
  if (hours < 12) return "Good morning";
  if (hours >= 12 && hours < 18) return "Good afternoon";
  return "Good evening";
};

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="font-extrabold text-3xl md:text-7xl">
        {handleGoodMorning()}!
      </h1>
      <Button size={"lg"} className="text-lg md:text-1xl" asChild>
        <Link href="/dragdrop">Access your tasks</Link>
      </Button>
    </div>
  );
};

export default Home;
