import { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ParticleCanvas = lazy(() => import("../components/ParticleCanvas"));

export default function MainLayout() {

  return (
    <>
      <Suspense fallback={null}>
        <ParticleCanvas />
      </Suspense>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}