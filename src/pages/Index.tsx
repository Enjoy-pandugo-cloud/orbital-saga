
import SolarSystem from "@/components/SolarSystem";

const Index = () => {
  return (
    <div className="w-full h-screen overflow-hidden relative">
      <div className="absolute top-0 left-0 z-10 p-4 max-w-md text-white bg-black/40 backdrop-blur-sm rounded-br-lg">
        <h1 className="text-xl font-bold mb-1">3D Solar System</h1>
        <p className="text-sm opacity-80">Interactive simulation based on NASA data</p>
      </div>
      <SolarSystem />
    </div>
  );
};

export default Index;
