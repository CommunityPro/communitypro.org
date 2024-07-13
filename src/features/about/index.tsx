import { useQuery } from "@tanstack/react-query"
import { Cursor } from "@phosphor-icons/react"
import classNames from "classnames"
import Link from "next/link"
import React from "react"

import { Appbar, Flex, Footer, Heading, Seo, Text } from "@/components/shared"
import { Button } from "@/components/ui/button"
import styles from "./style.module.scss"
import { GetOrgMembers } from "./query"
import { Card } from "./components"
import { OurValues } from "./data"

export const About = () => {
	const { data } = useQuery({
		queryFn: () => GetOrgMembers("Communitypro"),
		queryKey: ["get-members"],
	})

	return (
		<>
			<Seo title="About" />
			<Appbar />
			<main className={styles.About}>
				<Flex className={styles.AboutHeader}>
					<Flex.Column className={styles.AboutHeaderContent}>
						<Heading.h2>All you need to know about us</Heading.h2>
						<Text.p>We are a team of creators and innovators.</Text.p>
						<a href="https://bit.ly/join-communitypro" target="_blank">
							<Button size="lg">Join</Button>
						</a>
					</Flex.Column>
					<Flex className={styles.AboutHeaderContent}>
						<Flex className={styles.Hero}></Flex>
					</Flex>
				</Flex>
				<Flex className={classNames([styles.AboutContainer, styles[`AboutContainer--1`]])}>
					<Flex.Column
						gap={50}
						className={classNames([styles.Content, styles[`Content--about`]])}>
						<Flex className={styles.AboutText}>
							<Flex.Column gap={8} className={styles.Box}>
								<Heading.h5 weight={600}>ABOUT</Heading.h5>
								<Text.p size="sm">
									CommunityPro, which stands for <b>Community Project</b>, is a community of
									developers combining ideas to build open source projects and solutions. We
									believe developers learn more by teaching and building, which is the heart of
									this community and the reason we exist; to enhance the abilities of developers
									through teaching other developers and building open source projects with the
									knowledge.
								</Text.p>
							</Flex.Column>
						</Flex>
					</Flex.Column>
				</Flex>
				<Flex className={classNames([styles.AboutContainer, styles[`AboutContainer--2`]])}>
					<Flex.Column gap={50} className={styles.Content}>
						<Flex.Column alignItems="center" gap={20} css={{ width: "50%" }}>
							<Heading.h4>The values we live by</Heading.h4>
						</Flex.Column>
						<Flex className={styles.Values}>
							<Flex className={styles.Background}></Flex>
							<Flex className={styles.Cards}>
								{OurValues.map((value, index) => (
									<Flex.Column key={index} className={styles.Card}>
										<Cursor size={18} weight="fill" className="text-primary-100" />
										<Text.p weight={700}>{value.label}</Text.p>
										<Text.p size="sm">{value.description}</Text.p>
									</Flex.Column>
								))}
							</Flex>
						</Flex>
					</Flex.Column>
				</Flex>
				<Flex className={classNames([styles.AboutContainer, styles[`AboutContainer--3`]])}>
					<Flex.Column gap={50} className={styles.Content}>
						<Flex.Column alignItems="center" gap={20} css={{ width: "50%" }}>
							<Text.p casing="uppercase" size="sm">
								what our members
							</Text.p>
							<Heading.h4>Testimonials</Heading.h4>
						</Flex.Column>
					</Flex.Column>
				</Flex>
				<Flex className={classNames([styles.AboutContainer, styles[`AboutContainer--4`]])}>
					<Flex.Column gap={50} className={styles.Content}>
						<Flex.Column alignItems="center" gap={20} css={{ width: "50%" }}>
							<Heading.h4>Our awesome members</Heading.h4>
						</Flex.Column>
						<Flex className={styles.Members}>
							{data?.map((user) => (
								<Card key={user.id} image={user.avatar_url} name={user.login} />
							))}
						</Flex>
						<Link href="/teams">
							<Button>See More</Button>
						</Link>
					</Flex.Column>
				</Flex>
			</main>
			<Footer />
		</>
	)
}
