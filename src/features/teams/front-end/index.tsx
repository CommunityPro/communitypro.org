import React from "react"

import { Appbar, Flex, Footer, Heading, Seo, Text } from "@/components/shared"
import styles from "./style.module.scss"

export const Frontend = () => {
	return (
		<>
			<Seo title="The Frontend Team" />
			<Appbar />
			<main className={styles.Frontend}>
				<Flex className={styles.Header}>
					<Flex.Column className={styles.HeaderContent}>
						<Heading.h2>Frontend Team</Heading.h2>
						<Text.p>We are a team of creators and innovators.</Text.p>
					</Flex.Column>
					<Flex className={styles.HeaderContent}>
						<Flex className={styles.Hero}></Flex>
					</Flex>
				</Flex>
				<Flex className={styles.Container}>
					<Flex.Column gap={50} className={styles.Content}></Flex.Column>
				</Flex>
			</main>
			<Footer />
		</>
	)
}
