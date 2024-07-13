import {} from "@phosphor-icons/react"
import Image from "next/image"
import React from "react"

import { GithubUserProps } from "@/types"

interface Props {
	user: GithubUserProps
}

export const Hover = ({ user }: Props) => {
	return (
		<div className="flex items-start gap-4">
			<div className="relative aspect-square size-12 rounded-full border border-gray-500">
				<Image
					src={user.avatar_url}
					alt={user.login}
					fill
					sizes="(max-width:1024px)100%"
					className="rounded-full object-cover"
				/>
			</div>
			<div className="flex w-full flex-col">
				<p className="font-medium">{user.login}</p>
			</div>
		</div>
	)
}
