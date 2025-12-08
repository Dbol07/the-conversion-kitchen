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
import Recipes from "./pages/Recipes";
import RecipeDetails from "./pages/RecipeDetails";
import RecipeConvertPreview from "./pages/RecipeConvertPreview";
import TemplatePreview from "./pages/TemplatePreview";

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

              {/* HOME */}
              <Route path="/" element={<Dashboard />} />

              {/* GUIDE */}
              <Route path="/guide" element={<ConversionsGuide />} />

              {/* RECIPES LIST */}
              <Route path="/recipes" element={<Recipes />} />

              {/* RECIPE DETAILS */}
              <Route path="/recipes/:id" element={<RecipeDetails />} />

              {/* RECIPE → CONVERTER PREVIEW */}
              <Route
                path="/recipes/:id/convert"
                element={<RecipeConvertPreview />}
              />

              {/* CALCULATOR */}
              <Route path="/calculator" element={<Calculator />} />

              {/* PRINTABLES */}
              <Route path="/printables" element={<Printables />} />

              {/* FAQ */}
              <Route path="/faq" element={<FAQ />} />

              {/* ABOUT */}
              <Route path="/about" element={<About />} />

              {/* TEMPLATE PREVIEW */}
              <Route
                path="/template/:name"
                element={<TemplatePreview />}
              />

            </Route>

            {/* NOT FOUND */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
