import { Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const UploadSection = () => {
  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    // Simulate upload - will be connected to backend later
    setTimeout(() => {
      toast.success("App uploaded successfully!");
      setUploading(false);
    }, 2000);
  };

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Upload className="w-6 h-6 text-primary" />
              Upload New App
            </CardTitle>
            <CardDescription>
              Add a new Android application to your repository
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="appName">App Name</Label>
                <Input id="appName" placeholder="Enter app name" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input id="version" placeholder="e.g., 1.0.0" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your app..." 
                  className="min-h-[100px]"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apkFile">APK File</Label>
                <Input 
                  id="apkFile" 
                  type="file" 
                  accept=".apk"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="iconFile">App Icon (Optional)</Label>
                <Input 
                  id="iconFile" 
                  type="file" 
                  accept="image/*"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={uploading}
                style={{ background: uploading ? undefined : "var(--gradient-primary)" }}
              >
                {uploading ? "Uploading..." : "Upload App"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default UploadSection;
