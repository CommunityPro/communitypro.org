import Image from "next/image"
import React from "react"

import { GithubUserProps } from "@/types"

interface Props {
	user: GithubUserProps
}

export const Card = ({ user }: Props) => {
	return (
		<div className="flex aspect-square w-[110px] flex-col items-center gap-4">
			<div className="relative !z-[1] aspect-square w-[75px] rounded-full border border-white bg-white before:absolute before:-right-1 before:top-0 before:h-full before:w-full before:rounded-full before:bg-primary-100">
				<Image
					src={user.avatar_url}
					alt={user.login}
					fill
					sizes="(max-width:1024px)100%"
					className="rounded-full object-cover"
				/>
			</div>
			<a
				href={user.html_url}
				target="_blank"
				className="text-xs text-white transition-all hover:underline">
				{user.login}
			</a>
		</div>
	)
}
