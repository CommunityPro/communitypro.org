import { Icon } from "@phosphor-icons/react"
import Image from "next/image"
import React from "react"

interface Props {
	image: string
	name: string
	role: string
	social: {
		icon: Icon
		url: string
	}[]
	stack: string[]
}

export const Moderator = ({ image, name, role, social, stack }: Props) => {
	return (
		<div className="flex max-w-[220px] flex-col items-center text-center">
			<div className="relative aspect-square size-[76px] rounded-full">
				<Image
					src={image}
					alt={name}
					fill
					sizes="(max-width:1024px)100%"
					className="rounded-full object-cover"
				/>
			</div>
			<p className="mb-2 mt-5 font-base text-lg">{name}</p>
			<p className="text-sm text-gray-300">{role}</p>
			<div className="my-1 flex flex-wrap items-center justify-center gap-1">
				{stack.map((item) => (
					<span key={item} className="text-xs uppercase text-gray-400">
						{item}
					</span>
				))}
			</div>
			<div className="flex items-center gap-3">
				{social.map((item) => (
					<a key={item.url} href={item.url} target="_blank">
						<item.icon size={18} weight="fill" />
					</a>
				))}
			</div>
		</div>
	)
}
