import axios from "axios"

import { GithubUserProps } from "@/types"

const GetOrgMembers = async (org: string, page?: number, per_page?: number) => {
	return axios
		.get<
			GithubUserProps[]
		>(`https://api.github.com/orgs/${org}/members?page=${page}&per_page=${per_page}`)
		.then((res) => res.data)
}

export { GetOrgMembers }
