
import { useState, useEffect } from "react"

/**
 * Breakpoint for mobile devices in pixels
 */
const MOBILE_BREAKPOINT = 768

/**
 * Hook to detect if the current viewport is mobile-sized
 * Uses a ResizeObserver for better performance than resize events
 * 
 * @returns boolean indicating if viewport is mobile-sized
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    // Initialize with current window size
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Set up media query listener for screen size changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const handleChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Use modern event listener pattern
    mql.addEventListener("change", handleChange)
    
    // Clean up
    return () => mql.removeEventListener("change", handleChange)
  }, [])

  // Default to non-mobile if undefined (SSR safety)
  return isMobile ?? false
}
