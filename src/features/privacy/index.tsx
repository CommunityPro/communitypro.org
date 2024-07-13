import React from "react"

import { Appbar, Flex, Footer, Heading, Seo, Text } from "@/components/shared"
import styles from "./style.module.scss"

export const Privacy = () => {
	return (
		<>
			<Seo title="Privacy Policy" />
			<Appbar />
			<main className={styles.Privacy}>
				<Flex className={styles.Header}>
					<Flex.Column className={styles.HeaderContent}>
						<Heading.h2>Privacy Policy</Heading.h2>
						<Text.p>Your data is in safe hands.</Text.p>
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
