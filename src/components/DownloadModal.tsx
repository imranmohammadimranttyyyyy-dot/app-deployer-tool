import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Package, Star, Clock, HardDrive } from "lucide-react";
import { useState } from "react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: {
    name: string;
    description: string;
    version: string;
    size: string;
    downloads: number;
    icon?: string;
    downloadUrl?: string;
  } | null;
}

const DownloadModal = ({ isOpen, onClose, app }: DownloadModalProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!app) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      if (app.downloadUrl) {
        window.location.href = app.downloadUrl;
      }
      setIsDownloading(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 bg-card/95 backdrop-blur-xl overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-pulse" />
        
        <div className="relative z-10">
          <DialogHeader className="text-center pb-4">
            {/* App Icon with glow effect */}
            <div className="mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden shadow-xl">
                {app.icon ? (
                  <img src={app.icon} alt={app.name} className="w-20 h-20 rounded-xl object-cover" />
                ) : (
                  <Package className="w-12 h-12 text-white" />
                )}
              </div>
            </div>
            
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {app.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* App Info Badges */}
            <div className="flex justify-center gap-3 flex-wrap">
              <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 bg-secondary/80">
                <HardDrive className="w-3.5 h-3.5" />
                {app.size}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 bg-secondary/80">
                <Clock className="w-3.5 h-3.5" />
                v{app.version}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 bg-secondary/80">
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                {app.downloads?.toLocaleString() || 0}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-center text-muted-foreground text-sm leading-relaxed px-4">
              {app.description}
            </p>

            {/* Download Button with Animation */}
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full h-14 text-lg font-semibold relative overflow-hidden group"
              style={{ background: "var(--gradient-primary)" }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              {isDownloading ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Downloading...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Download className="w-6 h-6 group-hover:animate-bounce" />
                  <span>Download APK</span>
                </div>
              )}
            </Button>

            {/* Safety Note */}
            <p className="text-center text-xs text-muted-foreground">
              ✓ Verified & Safe to Install
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadModal;
