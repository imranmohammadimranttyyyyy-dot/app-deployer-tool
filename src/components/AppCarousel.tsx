import { useRef } from "react";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface App {
  id: string;
  name: string;
  description: string;
  version: string;
  size: string;
  downloads: number | null;
  icon_url: string | null;
  apk_url: string;
}

interface AppCarouselProps {
  title: string;
  apps: App[];
  onAppClick: (app: App) => void;
}

const AppCarousel = ({ title, apps, onAppClick }: AppCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (apps.length === 0) return null;

  return (
    <div className="relative group/carousel py-4">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-6 px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title}
        </h2>
        <div className="hidden md:flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="rounded-full border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="rounded-full border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Gradient Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {apps.map((app, index) => (
            <div
              key={app.id}
              onClick={() => onAppClick(app)}
              className="flex-shrink-0 w-[280px] snap-start cursor-pointer group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-primary/50 group-hover:shadow-primary/20">
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                
                {/* App Icon Header */}
                <div className="relative p-6 pb-4">
                  <div className="relative mx-auto w-20 h-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                    <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden shadow-lg">
                      {app.icon_url ? (
                        <img src={app.icon_url} alt={app.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <Package className="w-10 h-10 text-white" />
                      )}
                    </div>
                  </div>
                </div>

                {/* App Info */}
                <div className="relative px-4 pb-6 text-center">
                  <h3 className="font-bold text-lg truncate mb-1 group-hover:text-primary transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
                    {app.description}
                  </p>
                  
                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {app.size}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      v{app.version}
                    </Badge>
                  </div>
                </div>

                {/* Hover Download Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppCarousel;
