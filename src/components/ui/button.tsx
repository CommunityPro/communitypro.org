import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-[50px] text-sm font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
	{
		variants: {
			variant: {
				default: "bg-primary-100 text-secondary hover:bg-primary-100/90",
				destructive: "bg-red-600 text-white hover:bg-red-500",
				outline: "border border-primary-100 bg-transparent hover:text-primary-100",
				secondary: "bg-secondary text-white hover:bg-secondary/80",
				ghost: "hover:bg-secondary hover:text-white",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-[50px] px-3",
				lg: "h-11 rounded-[50px] px-8",
				icon: "h-10 w-10 rounded-full",
			},
		},
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
