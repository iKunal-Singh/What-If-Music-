
import React from "react";
import { Music } from "lucide-react";
import GenreItem from "./GenreItem";

const GenreFilter = () => {
  // List of genres with their corresponding icons and colors
  const genres = [
    {
      name: "Hip Hop",
      icon: <Music size={24} />,
      color: "bg-beatwave-500"
    },
    {
      name: "Chill",
      icon: <Music size={24} />,
      color: "bg-blue-500"
    },
    {
      name: "Techno",
      icon: <Music size={24} />,
      color: "bg-purple-500"
    },
    {
      name: "Soul",
      icon: <Music size={24} />,
      color: "bg-amber-500"
    },
    {
      name: "Funk",
      icon: <Music size={24} />,
      color: "bg-green-500"
    },
    {
      name: "Jazz",
      icon: <Music size={24} />,
      color: "bg-pink-500"
    }
  ];

  return (
    <div className="py-4 px-4 overflow-x-auto">
      <div className="container mx-auto">
        <div className="flex gap-4 pb-2 overflow-x-auto">
          {genres.map((genre) => (
            <GenreItem
              key={genre.name}
              name={genre.name}
              icon={genre.icon}
              color={genre.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenreFilter;
