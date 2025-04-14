
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme, ThemeType } from "@/contexts/ThemeContext";
import { 
  Sparkles, 
  Disc3, 
  Zap,
  RotateCcw
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ThemeSwitcher = () => {
  const { currentTheme, setTheme } = useTheme();

  const themes = [
    {
      id: "default",
      name: "Default",
      icon: <RotateCcw size={16} />,
      description: "Original theme",
    },
    {
      id: "synthwave",
      name: "Synthwave",
      icon: <Sparkles size={16} />,
      description: "Retro 80s vibes",
    },
    {
      id: "vinylGroove",
      name: "Vinyl Groove",
      icon: <Disc3 size={16} />,
      description: "Classic record shop feel",
    },
    {
      id: "neonPunk",
      name: "Neon Punk",
      icon: <Zap size={16} />,
      description: "Electric and vibrant",
    },
  ];

  const currentThemeData = themes.find((theme) => theme.id === currentTheme) || themes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "gap-2 transition-all",
            currentTheme === "synthwave" && "border-purple-500 text-purple-500",
            currentTheme === "vinylGroove" && "border-amber-600 text-amber-600",
            currentTheme === "neonPunk" && "border-green-500 text-green-500"
          )}
        >
          {currentThemeData.icon}
          {currentThemeData.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Visual Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup 
          value={currentTheme} 
          onValueChange={(value) => setTheme(value as ThemeType)}
        >
          {themes.map((theme) => (
            <DropdownMenuRadioItem 
              key={theme.id} 
              value={theme.id}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {theme.icon}
                <div>
                  <p className="font-medium">{theme.name}</p>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                </div>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
