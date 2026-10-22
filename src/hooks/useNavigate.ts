import { useContext } from "react";
import { NavigationContext } from "../store/NavigationContext";

export function useNavigate() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigate must be used within a NavigationProvider");
  }
  return context.navigate;
}

export { NavigationContext };
