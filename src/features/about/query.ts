import axios from "axios"

import { GithubUserProps } from "@/types"

const GetOrgMembers = async (org: string, page?: number) => {
	return axios
		.get<GithubUserProps[]>(`https://api.github.com/orgs/${org}/members?page=${page}`)
		.then((res) => res.data)
}

export { GetOrgMembers }
