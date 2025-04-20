import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow w-full container mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
