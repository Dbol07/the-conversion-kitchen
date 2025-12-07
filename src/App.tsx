import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import AppLayout from "./components/AppLayout";
import PageWrapper from "@/components/PageWrapper";

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
                  <PageWrapper>
                    <Dashboard />
                  </PageWrapper>
                }
              />

              {/* GUIDE */}
              <Route
                path="/guide"
                element={
                  <PageWrapper>
                    <ConversionsGuide />
                  </PageWrapper>
                }
              />

              {/* RECIPES */}
              <Route
                path="/recipes"
                element={
                  <PageWrapper>
                    <Recipes />
                  </PageWrapper>
                }
              />

              <Route
                path="/recipes/:id"
                element={
                  <PageWrapper>
                    <RecipeDetails />
                  </PageWrapper>
                }
              />

              <Route
                path="/recipes/:id/convert"
                element={
                  <PageWrapper>
                    <RecipeConvertPreview />
                  </PageWrapper>
                }
              />

              {/* CALCULATOR */}
              <Route
                path="/calculator"
                element={
                  <PageWrapper>
                    <Calculator />
                  </PageWrapper>
                }
              />

              {/* PRINTABLES */}
              <Route
                path="/printables"
                element={
                  <PageWrapper>
                    <Printables />
                  </PageWrapper>
                }
              />

              {/* INFO */}
              <Route
                path="/faq"
                element={
                  <PageWrapper>
                    <FAQ />
                  </PageWrapper>
                }
              />

              <Route
                path="/about"
                element={
                  <PageWrapper>
                    <About />
                  </PageWrapper>
                }
              />

              {/* TEMPLATE PREVIEW (Cookie, Cake, Bread) */}
              <Route
                path="/template/:name"
                element={
                  <PageWrapper>
                    <TemplatePreview />
                  </PageWrapper>
                }
              />
            </Route>

            {/* 404 */}
            <Route
              path="*"
              element={
                <PageWrapper>
                  <NotFound />
                </PageWrapper>
              }
            />
          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
