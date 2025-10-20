"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { GoArrowUpRight } from "react-icons/go"
import { cn } from "@/lib/utils"

type ButtonCompProps = {
  label?: string
  onClick?: () => void
  icon?: React.ReactNode
  bgColor?: string
  textColor?: string
  hoverColor?: string
  textSize?: string
  iconBg?: string
  iconTextColor?: string
  className?: string
}

function ButtonComp({
  label = "Join the Movement",
  onClick = () => {},
  icon = <GoArrowUpRight size={24} />,
  bgColor = "bg-cta",
  textColor = "text-cta-foreground",
  hoverColor = "hover:bg-cta/90",
  textSize = "text-[16px]",
  iconBg = "bg-white",
  iconTextColor = "text-black",
  className = "",
}: ButtonCompProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "group relative flex items-center overflow-hidden rounded-full px-4 py-6 font-semibold transition-all duration-300 ease-out",
        "isolate",
        bgColor,
        textColor,
        hoverColor,
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100"
      />
      <span className={cn("relative z-10 font-medium font-serif", textSize)}>{label}</span>
      <span
        aria-hidden
        className={cn(
          "relative z-10 ml-3 flex items-center justify-center rounded-full p-2 text-[20px] transition-transform duration-300 ease-out group-hover:translate-x-2",
          iconBg,
          iconTextColor
        )}
      >
        {icon}
      </span>
    </Button>
  )
}

export default ButtonComp
