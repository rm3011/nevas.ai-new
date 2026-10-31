import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/NotFound"; 

const Home = lazy(() => import("../pages/Home"));
const Blogs = lazy(() => import("../pages/Blogs"));
const BlogPost = lazy(() => import("../pages/BlogPost"));

function LoadingPage() {
  return (
    <div
      className="min-h-screen bg-cyber-bg pt-32 text-center font-mono text-sm text-gray-400"
      role="status"
    >
      Loading page...
    </div>
  );
}

function lazyPage(element: ReactNode) {
  return <Suspense fallback={<LoadingPage />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: lazyPage(<Home />) },
      { path: "blogs", element: lazyPage(<Blogs />) },
      { path: "blogs/:slug", element: lazyPage(<BlogPost />) },
      { path: "*", element: <NotFound /> }
    ],
  },
]);