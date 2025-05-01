import { Outlet } from "react-router-dom";
import HeaderBar from "@/components/layout/HeaderBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderBar />
      <main className="pt-8 pb-8">
        <div className="max-w-[1600px] mx-auto px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
