
import React from "react";
import { cn } from "@/lib/utils";

interface GenreItemProps {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const GenreItem = ({ name, icon, color }: GenreItemProps) => {
  return (
    <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all hover:scale-105", color)}>
      {icon}
      <span className="text-white font-medium">{name}</span>
    </div>
  );
};

export default GenreItem;
