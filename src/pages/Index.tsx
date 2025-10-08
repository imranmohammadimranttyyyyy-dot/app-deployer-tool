import Hero from "@/components/Hero";
import AppGrid from "@/components/AppGrid";
import UploadSection from "@/components/UploadSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <AppGrid />
      <UploadSection />
    </div>
  );
};

export default Index;
