import AppCard from "./AppCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface App {
  id: string;
  name: string;
  description: string;
  version: string;
  size: string;
  downloads: number;
  apk_url: string;
  icon_url: string | null;
}

const AppGrid = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setApps(data || []);
    } catch (error: any) {
      console.error("Error fetching apps:", error);
      toast.error("Failed to load apps");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">Loading apps...</p>
        </div>
      </section>
    );
  }

  if (apps.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Apps</h2>
          <p className="text-muted-foreground">No apps available yet. Upload your first app below!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Apps</h2>
          <p className="text-muted-foreground">Browse our collection of verified Android applications</p>
        </div>
        
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
      </div>
    </section>
  );
};

export default AppGrid;
