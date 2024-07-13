import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import Image from "next/image"
import React from "react"

import { Appbar, Flex, Footer, Heading, Seo, Text } from "@/components/shared"
import { HeroImages, OurLanguages, SocialLinks, TopModerators } from "./data"
import { Card, Faq, Moderator, Numbers, Project } from "./components"
import { Button } from "@/components/ui/button"
import { GetGithubUser } from "./query"
import styles from "./home.module.scss"

export const Home = () => {
	const { data } = useQuery({
		queryFn: () => GetGithubUser("Communitypro"),
		queryKey: ["get-github-user"],
		enabled: false,
	})

	return (
		<>
			<Seo title="Join CommunityPro" />
			<Appbar />
			<main className={styles.Home}>
				<Flex className={styles.HomeHeader}>
					<Flex.Column className={styles.HomeHeaderContent}>
						<Heading.h2>Connect with fellow developers</Heading.h2>
						<Text.p>
							CommunityPro which stands for Community Project, is a community of developers
							combining ideas to build open source projects and solutions. We believe developers
							learn more by teaching and building, which is the heart of this community and the
							reason we exist; to enhance the abilities of developers through teaching other
							developers and building open source projects with the knowledge.
						</Text.p>
						<a href="https://bit.ly/join-communitypro" target="_blank">
							<Button size="lg">Join</Button>
						</a>
						<Flex.Column gap={8} css={{ marginTop: "28px" }}>
							<Text.p size="sm">Follow us on our social media handles</Text.p>
							<Flex gap={12}>
								{SocialLinks.map((link) => (
									<a key={link.href} href={link.href} target="_blank">
										<link.icon size={24} weight="fill" />
									</a>
								))}
							</Flex>
						</Flex.Column>
					</Flex.Column>
					<Flex className={styles.HomeHeaderContent}>
						<Flex className={styles.Hero}>
							{HeroImages.map((image, id) => (
								<Flex key={id} className={styles.HeroImage}>
									<Flex className={styles.Image}>
										<Image
											src={image}
											alt={`image-${id}`}
											fill
											sizes="(max-width:1024px)100%"
											className={styles.image}
										/>
									</Flex>
								</Flex>
							))}
						</Flex>
					</Flex>
				</Flex>
				<Flex className={classNames([styles.HomeContainer, styles[`HomeContainer--1`]])}>
					<Flex.Column gap={50} className={styles.Content}>
						<Flex.Column alignItems="center" gap={20} css={{ width: "50%" }}>
							<Text.p casing="uppercase" size="sm">
								our achievements
							</Text.p>
							<Heading.h4>You can contribute by being a part of our community</Heading.h4>
						</Flex.Column>
						<Flex justifyContent="space-between" className="w-[60%]">
							<Numbers color="#cc444b" count={data?.followers} title="Followers" />
							<Numbers color="#7b61ff" count={data?.public_repos} title="Public Repos" />
							<Numbers color="#7aa9ef" count={data?.public_gists} title="Gists" />
						</Flex>
					</Flex.Column>
				</Flex>
				<Flex className={classNames([styles.HomeContainer, styles[`HomeContainer--2`]])}>
					<Flex.Column gap={50} className={styles.Content}>
						<Flex.Column alignItems="center" gap={20} css={{ width: "50%" }}>
							<Text.p casing="uppercase" size="sm">
								join us now
							</Text.p>
							<Heading.h4>Our contributors around the world</Heading.h4>
						</Flex.Column>
						<Flex className="h-[606px] w-full bg-round-map"></Flex>
					</Flex.Column>
				</Flex>
				<Flex className={classNames([styles.HomeContainer])}>
					<Flex.Column gap={50} className={styles.Content}>
						<Flex.Column alignItems="center" gap={20} css={{ width: "50%" }}>
							<Text.p casing="uppercase" size="sm">
								our programming languages
							</Text.p>
							<Heading.h4>You can contribute by being a part of our community</Heading.h4>
						</Flex.Column>
						<div className="grid grid-cols-3 gap-10">
							{OurLanguages.map((lang, id) => (
								<Card key={id} {...lang} />
							))}
						</div>
					</Flex.Column>
				</Flex>
				<Flex className={classNames([styles.HomeContainer, styles[`HomeContainer--3`]])}>
					<Flex.Column gap={50} className={styles.Content}>
						<Flex.Column alignItems="center" gap={20} css={{ width: "50%" }}>
							<Text.p casing="uppercase" size="sm">
								our projects
							</Text.p>
							<Heading.h4>Showcasing what we have built together</Heading.h4>
						</Flex.Column>
						<Project />
					</Flex.Column>
				</Flex>
				<Flex className={classNames([styles.HomeContainer, styles[`HomeContainer--2`]])}>
					<Flex.Column gap={50} className={styles.Content}>
						<Flex.Column alignItems="center" gap={20} css={{ width: "50%" }}>
							<Text.p casing="uppercase" size="sm">
								testimonial
							</Text.p>
							<Heading.h4>Hear what our members have to say</Heading.h4>
						</Flex.Column>
					</Flex.Column>
				</Flex>
				<Flex className={classNames([styles.HomeContainer])}>
					<Flex.Column gap={50} className={styles.Content}>
						<Flex.Column alignItems="center" gap={20} css={{ width: "50%" }}>
							<Text.p casing="uppercase" size="sm">
								the team
							</Text.p>
							<Heading.h4>Meet our top moderators</Heading.h4>
						</Flex.Column>
						<Flex gap={24}>
							{TopModerators.map((moderator, id) => (
								<Moderator key={id} {...moderator} />
							))}
						</Flex>
					</Flex.Column>
				</Flex>
				<Flex className={classNames([styles.HomeContainer, styles[`HomeContainer--4`]])}>
					<Flex.Column gap={50} className={styles.Content}>
						<Flex.Column alignItems="center" gap={20} css={{ width: "50%" }}>
							<Text.p casing="uppercase" size="sm">
								faqs
							</Text.p>
							<Heading.h4>We are always willing to help you</Heading.h4>
						</Flex.Column>
						<Faq />
					</Flex.Column>
				</Flex>
			</main>
			<Footer />
		</>
	)
}
