import Image from "next/image"
import React from "react"

interface Props {
	image: string
	name: string
}

export const Card = ({ image, name }: Props) => {
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="relative !z-[1] aspect-square w-[75px] rounded-full border border-white bg-white before:absolute before:-right-1 before:top-0 before:h-full before:w-full before:rounded-full before:bg-primary-100">
				<Image
					src={image}
					alt={name}
					fill
					sizes="(max-width:1024px)100%"
					className="rounded-full object-cover"
				/>
			</div>
			<p className="text-xs text-white">{name}</p>
		</div>
	)
}
