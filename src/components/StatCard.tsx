import { CardType } from "@/enums/statCard";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface StatCardProps {
  type: CardType;
  count: number;
  label: string;
  icon: string;
}

const StatCard = ({ type, count = 0, icon, label }: StatCardProps) => {
  return (
    <div
      className={cn("stat-card", {
        "bg-appointments": type === CardType.APPOINTMENTS,
        "bg-pending": type === CardType.PENDING,
        "bg-cancelled": type === CardType.CANCELLED,
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          height={32}
          width={32}
          alt={label}
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white">{count}</h2>
      </div>

      <p className="text-14-regular">{label}</p>
    </div>
  );
};

export default StatCard;
