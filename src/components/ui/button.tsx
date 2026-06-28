import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap outline-none disabled:pointer-events-none disabled:opacity-50 rounded-none",
  {
    variants: {
      variant: {
        default: [
          "bg-[#C41E1E] text-white",
          "font-sans text-[11px] tracking-[0.2em] uppercase",
          "rounded-none",
          "hover:bg-[#E8282B] transition-colors duration-150",
          "active:scale-[0.97] transition-transform duration-[80ms]",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C41E1E] focus-visible:ring-offset-0",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
        ].join(' '),
        secondary: [
          "bg-transparent text-[#E8E6E0]",
          "font-sans text-[11px] tracking-[0.2em] uppercase",
          "rounded-none",
          "border border-[#2A2A2A]",
          "hover:border-[#E8E6E0] transition-colors duration-150",
          "active:scale-[0.97] transition-transform duration-[80ms]",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2A2A2A] focus-visible:ring-offset-0",
        ].join(' '),
        ghost:
          "bg-transparent text-[#767676] font-sans text-[11px] tracking-[0.2em] uppercase hover:text-[#E8E6E0] transition-colors duration-150",
        link: 
          "font-serif text-[18px] italic text-[#C41E1E] hover:text-[#E8E6E0] transition-colors duration-150",
      },
      size: {
        default: "px-8 py-3",
        sm: "px-4 py-2 text-[10px]",
        icon: "w-10 h-10 p-0",
        link: "p-0",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        size: "default",
        className: "px-0 py-0",
      }
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
