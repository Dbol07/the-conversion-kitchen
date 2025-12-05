import { useLocation } from "react-router-dom";
import { type DividerVariant } from "./Dividers";

export default function usePageDivider(): DividerVariant {
  const { pathname } = useLocation();

  if (pathname.startsWith("/recipes/") && pathname.includes("/convert"))
    return "mushroom-wide";

  if (pathname.startsWith("/recipes/"))
    return "mushroom";

  if (pathname.startsWith("/recipes"))
    return "floral";

  if (pathname.startsWith("/guide"))
    return "floral-thin";

  if (pathname.startsWith("/calculator"))
    return "vine";

  if (pathname.startsWith("/printables"))
    return "flower";

  if (pathname.startsWith("/about"))
    return "floral";

  if (pathname.startsWith("/faq"))
    return "floral-thin";

  if (pathname.startsWith("/template"))
    return "vine-light";

  return "vine-light"; // Dashboard + fallback
}
