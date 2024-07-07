import { ClassValue } from "clsx";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ButtonProps {
  isLoading: boolean;
  className?: ClassValue;
  children: React.ReactNode;
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={cn(className && className, "shad-primary-btn w-full")}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src={"/assets/icons/loader.svg"}
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          <span>Loading</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
