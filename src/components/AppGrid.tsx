import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles } from "lucide-react";
import AppCarousel from "./AppCarousel";
import DownloadModal from "./DownloadModal";

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

const AppGrid = () => {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: apps, isLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as App[];
    },
  });

  const handleAppClick = (app: App) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const recentApps = apps?.slice(0, 10) || [];
  const popularApps = apps?.sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 10) || [];

  return (
    <section className="py-8 md:py-16">
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-24 gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 animate-pulse" />
            <Loader2 className="relative w-12 h-12 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground animate-pulse">Loading apps...</p>
        </div>
      ) : apps && apps.length > 0 ? (
        <div className="space-y-12">
          {/* New Arrivals Section */}
          <AppCarousel 
            title="🆕 New Arrivals" 
            apps={recentApps} 
            onAppClick={handleAppClick} 
          />

          {/* Popular Apps Section */}
          {popularApps.length > 0 && (
            <AppCarousel 
              title="🔥 Popular Apps" 
              apps={popularApps} 
              onAppClick={handleAppClick} 
            />
          )}

          {/* All Apps Section */}
          <AppCarousel 
            title="📱 All Apps" 
            apps={apps} 
            onAppClick={handleAppClick} 
          />
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No Apps Yet</h3>
          <p className="text-muted-foreground">
            Apps will appear here once uploaded by admin
          </p>
        </div>
      )}

      {/* Download Modal */}
      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        app={selectedApp ? {
          name: selectedApp.name,
          description: selectedApp.description,
          version: selectedApp.version,
          size: selectedApp.size,
          downloads: selectedApp.downloads || 0,
          icon: selectedApp.icon_url || undefined,
          downloadUrl: selectedApp.apk_url,
        } : null}
      />
    </section>
  );
};

export default AppGrid;
