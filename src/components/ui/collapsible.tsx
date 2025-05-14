
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * Collapsible component for showing and hiding content
 * Built on top of Radix UI Collapsible primitive
 */
const Collapsible = CollapsiblePrimitive.Root

/**
 * The trigger button that toggles the collapsible content
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

/**
 * The content that will be shown/hidden based on the collapsible state
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { 
  Collapsible, 
  CollapsibleTrigger, 
  CollapsibleContent 
}
