import AppCard from "./AppCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AppGrid = () => {
  const { data: apps, isLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Apps</h2>
          <p className="text-muted-foreground">Browse our collection of verified Android applications</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : apps && apps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <AppCard 
                key={app.id} 
                name={app.name}
                description={app.description}
                version={app.version}
                size={app.size}
                downloads={app.downloads}
                icon={app.icon_url || undefined}
                downloadUrl={app.apk_url}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No apps uploaded yet. Upload your first app below!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AppGrid;
