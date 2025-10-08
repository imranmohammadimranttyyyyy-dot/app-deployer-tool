import { Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const UploadSection = () => {
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const appName = formData.get('appName') as string;
      const version = formData.get('version') as string;
      const description = formData.get('description') as string;
      const apkFile = formData.get('apkFile') as File;
      const iconFile = formData.get('iconFile') as File | null;
      
      if (!apkFile) {
        toast.error("Please select an APK file");
        setUploading(false);
        return;
      }
      
      // Upload APK file
      const apkFileName = `${Date.now()}-${apkFile.name}`;
      const { error: apkError, data: apkData } = await supabase.storage
        .from('apk-files')
        .upload(apkFileName, apkFile);
      
      if (apkError) throw apkError;
      
      const { data: { publicUrl: apkUrl } } = supabase.storage
        .from('apk-files')
        .getPublicUrl(apkFileName);
      
      // Upload icon if provided
      let iconUrl = null;
      if (iconFile && iconFile.size > 0) {
        const iconFileName = `${Date.now()}-${iconFile.name}`;
        const { error: iconError } = await supabase.storage
          .from('app-icons')
          .upload(iconFileName, iconFile);
        
        if (iconError) throw iconError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('app-icons')
          .getPublicUrl(iconFileName);
        iconUrl = publicUrl;
      }
      
      // Calculate file size in MB
      const sizeInMB = (apkFile.size / (1024 * 1024)).toFixed(2);
      
      // Save to database
      const { error: dbError } = await supabase
        .from('apps')
        .insert({
          name: appName,
          version,
          description,
          size: `${sizeInMB} MB`,
          apk_url: apkUrl,
          icon_url: iconUrl,
        });
      
      if (dbError) throw dbError;
      
      toast.success("App uploaded successfully!");
      e.currentTarget.reset();
      
      // Refresh the page to show new app
      window.location.reload();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
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
                <Input id="appName" name="appName" placeholder="Enter app name" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input id="version" name="version" placeholder="e.g., 1.0.0" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  placeholder="Describe your app..." 
                  className="min-h-[100px]"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apkFile">APK File</Label>
                <Input 
                  id="apkFile" 
                  name="apkFile"
                  type="file" 
                  accept=".apk"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="iconFile">App Icon (Optional)</Label>
                <Input 
                  id="iconFile"
                  name="iconFile" 
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
