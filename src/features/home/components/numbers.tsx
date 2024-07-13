import React from "react"

import { useCountUp } from "@/hooks"

interface Props {
	color?: string
	count?: number
	title?: string
}

export const Numbers = ({ color, count, title }: Props) => {
	return (
		<div className="flex flex-col items-center gap-6">
			<div className="flex items-baseline">
				<div style={{ background: color }} className="relative aspect-square w-12">
					<p className="absolute -bottom-2 left-[80%] font-secondary text-4xl font-semibold text-white">
						{useCountUp(count)}
					</p>
				</div>
			</div>
			<p className="text-2xl">{title}</p>
		</div>
	)
}
