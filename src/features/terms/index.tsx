import React from "react"

import { Appbar, Flex, Footer, Heading, Seo, Text } from "@/components/shared"
import styles from "./style.module.scss"

export const Terms = () => {
	return (
		<>
			<Seo title="Terms & Conditions" />
			<Appbar />
			<main className={styles.Terms}>
				<Flex className={styles.Header}>
					<Flex.Column className={styles.HeaderContent}>
						<Heading.h2>Terms & Conditions</Heading.h2>
						<Text.p>We have some rules here too.</Text.p>
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
