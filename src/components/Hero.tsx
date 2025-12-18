import { Download, Shield, Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Hero = () => {
  const { user, isAdmin } = useAuth();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Premium APK Store</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            Download Your Favorite
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Android Apps
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
          Fast, secure, and free downloads. Get the latest APK files for your Android device with one-click install.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Button
            size="lg"
            className="h-14 px-8 text-lg font-semibold rounded-full relative overflow-hidden group"
            style={{ background: "var(--gradient-primary)" }}
            onClick={() => {
              document.querySelector('section:nth-of-type(2)')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            Browse Apps
          </Button>

          {user && isAdmin && (
            <Link to="/admin">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-semibold rounded-full border-2 hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <Settings className="w-5 h-5 mr-2" />
                Admin Panel
              </Button>
            </Link>
          )}

          {!user && (
            <Link to="/auth">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-semibold rounded-full border-2 hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                Admin Login
              </Button>
            </Link>
          )}
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-16 animate-fade-in" style={{ animationDelay: '400ms' }}>
          {[
            { icon: Shield, text: "100% Safe Files" },
            { icon: Zap, text: "Fast Downloads" },
            { icon: Download, text: "Free Forever" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur border border-border/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
