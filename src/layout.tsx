import { Outlet } from "react-router-dom";
import { Header } from "./components/generated/Header";
import { Footer } from "./components/generated/Footer";
import { Watermark } from "./components/generated/Watermark";

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
      <Watermark />
    </div>
  );
}
