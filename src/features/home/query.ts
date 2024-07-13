import axios from "axios"

import { GithubUserProps } from "@/types"

const GetGithubUser = async (username: string) => {
	return axios
		.get<GithubUserProps>(`https://api.github.com/users/${username}`)
		.then((res) => res.data)
}

export { GetGithubUser }
