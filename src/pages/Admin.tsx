import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, LogOut, Upload, Pencil, Trash2, Home, Package } from 'lucide-react';

interface App {
  id: string;
  name: string;
  version: string;
  description: string;
  size: string;
  icon_url: string | null;
  apk_url: string;
  downloads: number;
  created_at: string;
}

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState<App[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    description: ''
  });
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setApps(data);
    if (error) console.error('Error fetching apps:', error);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apkFile || !formData.name || !formData.version) {
      toast({ title: 'Error', description: 'Name, version aur APK file required hai', variant: 'destructive' });
      return;
    }

    setIsUploading(true);

    try {
      const timestamp = Date.now();
      const apkPath = `${timestamp}-${apkFile.name}`;
      
      const { error: apkError } = await supabase.storage
        .from('apk-files')
        .upload(apkPath, apkFile);

      if (apkError) throw apkError;

      const { data: apkUrlData } = supabase.storage.from('apk-files').getPublicUrl(apkPath);

      let iconUrl = null;
      if (iconFile) {
        const iconPath = `${timestamp}-${iconFile.name}`;
        await supabase.storage.from('app-icons').upload(iconPath, iconFile);
        const { data: iconUrlData } = supabase.storage.from('app-icons').getPublicUrl(iconPath);
        iconUrl = iconUrlData.publicUrl;
      }

      const fileSizeMB = (apkFile.size / (1024 * 1024)).toFixed(1);

      const { error: dbError } = await supabase.from('apps').insert({
        name: formData.name,
        version: formData.version,
        description: formData.description || 'No description',
        size: `${fileSizeMB} MB`,
        apk_url: apkUrlData.publicUrl,
        icon_url: iconUrl
      });

      if (dbError) throw dbError;

      toast({ title: 'Success!', description: 'App upload ho gaya' });
      setFormData({ name: '', version: '', description: '' });
      setApkFile(null);
      setIconFile(null);
      fetchApps();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingApp) return;

    try {
      const { error } = await supabase
        .from('apps')
        .update({
          name: formData.name,
          version: formData.version,
          description: formData.description
        })
        .eq('id', editingApp.id);

      if (error) throw error;

      toast({ title: 'Success!', description: 'App update ho gaya' });
      setEditingApp(null);
      setFormData({ name: '', version: '', description: '' });
      fetchApps();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (app: App) => {
    if (!confirm(`Kya aap "${app.name}" ko delete karna chahte ho?`)) return;

    try {
      const { error } = await supabase.from('apps').delete().eq('id', app.id);
      if (error) throw error;

      toast({ title: 'Deleted!', description: 'App delete ho gaya' });
      fetchApps();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const openEditDialog = (app: App) => {
    setEditingApp(app);
    setFormData({
      name: app.name,
      version: app.version,
      description: app.description
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
            {isAdmin && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Admin</span>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload New App
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label>App Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My App"
                    disabled={isUploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Version *</Label>
                  <Input
                    value={formData.version}
                    onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="1.0.0"
                    disabled={isUploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="App ka description..."
                    disabled={isUploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>APK File *</Label>
                  <Input
                    type="file"
                    accept=".apk"
                    onChange={(e) => setApkFile(e.target.files?.[0] || null)}
                    disabled={isUploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon (Optional)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                    disabled={isUploading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isUploading}>
                  {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Upload App
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Apps List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>All Apps ({apps.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {apps.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Koi app nahi hai. Pehle upload karein!</p>
              ) : (
                <div className="space-y-3">
                  {apps.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {app.icon_url ? (
                          <img src={app.icon_url} alt={app.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{app.name}</h3>
                          <p className="text-sm text-muted-foreground">v{app.version} • {app.size} • {app.downloads} downloads</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(app)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit App</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div className="space-y-2">
                                <Label>App Name</Label>
                                <Input
                                  value={formData.name}
                                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Version</Label>
                                <Input
                                  value={formData.version}
                                  onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={formData.description}
                                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                />
                              </div>
                              <Button className="w-full" onClick={handleEdit}>
                                Save Changes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(app)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
