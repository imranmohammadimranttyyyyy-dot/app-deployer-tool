import AppCard from "./AppCard";

const AppGrid = () => {
  // Sample data - will be replaced with real data from database
  const sampleApps = [
    {
      id: 1,
      name: "Social Connect",
      description: "Connect with friends and family through secure messaging and video calls",
      version: "2.5.0",
      size: "45 MB",
      downloads: 50000,
    },
    {
      id: 2,
      name: "Photo Editor Pro",
      description: "Professional photo editing with advanced filters and AI enhancements",
      version: "3.2.1",
      size: "38 MB",
      downloads: 35000,
    },
    {
      id: 3,
      name: "Fitness Tracker",
      description: "Track your workouts, calories, and health goals with ease",
      version: "1.8.5",
      size: "22 MB",
      downloads: 28000,
    },
    {
      id: 4,
      name: "Music Player Plus",
      description: "High-quality music player with equalizer and playlist management",
      version: "4.0.2",
      size: "18 MB",
      downloads: 42000,
    },
    {
      id: 5,
      name: "Note Master",
      description: "Organize your thoughts with rich text notes and cloud sync",
      version: "2.1.3",
      size: "12 MB",
      downloads: 19000,
    },
    {
      id: 6,
      name: "Weather Plus",
      description: "Accurate weather forecasts with beautiful widgets and alerts",
      version: "1.5.0",
      size: "15 MB",
      downloads: 31000,
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Apps</h2>
          <p className="text-muted-foreground">Browse our collection of verified Android applications</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleApps.map((app) => (
            <AppCard key={app.id} {...app} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppGrid;
