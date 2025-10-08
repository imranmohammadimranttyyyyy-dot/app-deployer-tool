import { Download, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AppCardProps {
  name: string;
  description: string;
  version: string;
  size: string;
  downloads: number;
  icon?: string;
  downloadUrl?: string;
}

const AppCard = ({ name, description, version, size, downloads, icon, downloadUrl }: AppCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-2 hover:border-primary/50">
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "var(--gradient-card)" }}
      />
      
      <CardHeader className="relative">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white flex-shrink-0">
            {icon ? (
              <img src={icon} alt={name} className="w-12 h-12 rounded-lg" />
            ) : (
              <Package className="w-8 h-8" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{name}</CardTitle>
            <CardDescription className="text-sm mt-1">Version {version}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {size}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {downloads.toLocaleString()} downloads
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="relative">
        <Button 
          className="w-full gap-2" 
          style={{ background: "var(--gradient-primary)" }}
          onClick={() => downloadUrl && window.open(downloadUrl, '_blank')}
        >
          <Download className="w-4 h-4" />
          Download APK
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppCard;
