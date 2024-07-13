import Image from "next/image"
import React from "react"

interface Props {
	name: string
	image: string
	description: string
	url: string
}

export const Card = ({ description, image, name }: Props) => {
	return (
		<div className="flex w-full flex-col items-center">
			<div className="relative aspect-square w-[50px]">
				<Image src={image} alt={name} fill sizes="(max-width:1024px)100%" />
			</div>
			<p className="mb-4 mt-12 font-base text-2xl">{name}</p>
			<p className="text-center font-secondary text-sm text-gray-400">{description}</p>
		</div>
	)
}
