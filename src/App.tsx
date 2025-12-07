import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import AppLayout from "./components/AppLayout";
import PageTransition from "@/components/PageTransition";

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
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                }
              />

              {/* GUIDE */}
              <Route
                path="/guide"
                element={
                  <PageTransition>
                    <ConversionsGuide />
                  </PageTransition>
                }
              />

              {/* RECIPES LIST */}
              <Route
                path="/recipes"
                element={
                  <PageTransition>
                    <Recipes />
                  </PageTransition>
                }
              />

              {/* RECIPE DETAILS */}
              <Route
                path="/recipes/:id"
                element={
                  <PageTransition>
                    <RecipeDetails />
                  </PageTransition>
                }
              />

              {/* RECIPE → CONVERTER PREVIEW (if used later) */}
              <Route
                path="/recipes/:id/convert"
                element={
                  <PageTransition>
                    <RecipeConvertPreview />
                  </PageTransition>
                }
              />

              {/* CALCULATOR */}
              <Route
                path="/calculator"
                element={
                  <PageTransition>
                    <Calculator />
                  </PageTransition>
                }
              />

              {/* PRINTABLES */}
              <Route
                path="/printables"
                element={
                  <PageTransition>
                    <Printables />
                  </PageTransition>
                }
              />

              {/* FAQ */}
              <Route
                path="/faq"
                element={
                  <PageTransition>
                    <FAQ />
                  </PageTransition>
                }
              />

              {/* ABOUT */}
              <Route
                path="/about"
                element={
                  <PageTransition>
                    <About />
                  </PageTransition>
                }
              />

              {/* TEMPLATE PREVIEWS */}
              <Route
                path="/template/:name"
                element={
                  <PageTransition>
                    <TemplatePreview />
                  </PageTransition>
                }
              />
            </Route>

            {/* 404 */}
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              }
            />
          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
