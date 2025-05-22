import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        spin: "animate-spin",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

const buttonMotionVariants = {
  tap: {
    scale: 0.95,
  },
  hover: {
    scale: 1.05,
  },
  initial: {
    scale: 1,
  }
};

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  motionEffect?: "scale" | "rotate" | "bounce" | "shine" | "none";
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, animation, motionEffect = "scale", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Effetti di hover/tap diversi in base al tipo di effetto scelto
    const getMotionProps = () => {
      switch (motionEffect) {
        case "scale":
          return {
            whileTap: { scale: 0.95 },
            whileHover: { scale: 1.05 },
          };
        case "rotate":
          return {
            whileTap: { rotate: -5 },
            whileHover: { rotate: 5 },
          };
        case "bounce":
          return {
            whileTap: { y: 2 },
            whileHover: { y: -4, transition: { duration: 0.2, repeat: Infinity, repeatType: "reverse" } },
          };
        case "shine":
          return {
            whileHover: { 
              boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.3)",
              transition: { duration: 0.2 }
            },
            whileTap: { boxShadow: "0 0 5px 1px rgba(255, 255, 255, 0.2)" }
          };
        case "none":
        default:
          return {};
      }
    };
    
    // Aggiungi classe per effetto "shine" che usa ::before
    const shineClass = motionEffect === "shine" ? "relative overflow-hidden shine-effect" : "";
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        {...getMotionProps()}
      >
        <Comp
          className={cn(buttonVariants({ variant, size, animation, className }), shineClass)}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, buttonVariants };