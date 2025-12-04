import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import AppLayout from "./components/AppLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import ConversionsGuide from "./pages/ConversionsGuide";
import Calculator from "./pages/Calculator";
import Printables from "./pages/Printables";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/guide" element={<ConversionsGuide />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/printables" element={<Printables />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
