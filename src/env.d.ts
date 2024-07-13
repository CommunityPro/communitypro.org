const requiredEnvs = ["NEXT_PUBLIC_APP_URL"] as const

type RequiredEnvs = (typeof requiredEnvs)[number]

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Record<RequiredEnvs, string> {
			readonly NEXT_PUBLIC_APP_URL: string
		}
	}
}

export {}
