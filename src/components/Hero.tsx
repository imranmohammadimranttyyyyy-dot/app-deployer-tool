import { Download, Package } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{ background: "var(--gradient-primary)" }}
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">APK Repository</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent" 
              style={{ backgroundImage: "var(--gradient-primary)" }}>
            Download Premium Apps
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trusted source for Android applications. Download verified APKs safely and securely.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
              <Download className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium">1000+</p>
                <p className="text-xs text-muted-foreground">Apps Available</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
              <Package className="w-5 h-5 text-accent" />
              <div className="text-left">
                <p className="text-sm font-medium">Safe</p>
                <p className="text-xs text-muted-foreground">Verified APKs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
