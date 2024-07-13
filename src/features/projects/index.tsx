import classNames from "classnames"
import React from "react"

import { Appbar, Flex, Footer, Heading, Seo, Text } from "@/components/shared"
import styles from "./style.module.scss"
// import {} from "./data"

export const Projects = () => {
	return (
		<>
			<Seo title="Projects" />
			<Appbar />
			<main className={styles.Projects}>
				<Flex className={styles.Header}>
					<Flex.Column className={styles.HeaderContent}>
						<Heading.h2>See our projects</Heading.h2>
						<Text.p>We are a team of creators and innovators.</Text.p>
					</Flex.Column>
					<Flex className={styles.HeaderContent}>
						<Flex className={styles.Hero}></Flex>
					</Flex>
				</Flex>
				<Flex className={classNames([styles.Container, styles[`Container--1`]])}>
					<Flex.Column gap={50} className={styles.Content}></Flex.Column>
				</Flex>
			</main>
			<Footer />
		</>
	)
}
