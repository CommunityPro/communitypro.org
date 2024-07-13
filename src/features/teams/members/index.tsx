import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import React from "react"

import { Appbar, Flex, Footer, Heading, Pagination, Seo, Text } from "@/components/shared"
import styles from "./style.module.scss"
import { GetOrgMembers } from "./query"
import { Card } from "./components"

const PER_PAGE = 40

export const Members = () => {
	const [page, setPage] = React.useState(1)

	const { data } = useQuery({
		queryFn: () => GetOrgMembers("communitypro", page, PER_PAGE),
		queryKey: ["get-members", page],
	})

	return (
		<>
			<Seo title="Members" />
			<Appbar />
			<main className={styles.Members}>
				<Flex className={styles.Header}>
					<Flex.Column className={styles.HeaderContent}>
						<Heading.h2>Members</Heading.h2>
						<Text.p></Text.p>
					</Flex.Column>
					<Flex className={styles.HeaderContent}>
						<Flex className={styles.Hero}></Flex>
					</Flex>
				</Flex>
				<Flex className={classNames([styles.Container, styles[`Container--1`]])}>
					<Flex.Column gap={50} className={styles.Content}>
						<Heading.h4>Our awesome members</Heading.h4>
						<Flex className={styles.MembersList}>
							{data?.map((user) => <Card key={user.id} user={user} />)}
						</Flex>
						<Pagination
							current={page}
							onPageChange={(page) => setPage(page)}
							pageSize={PER_PAGE}
							total={225}
						/>
					</Flex.Column>
				</Flex>
			</main>
			<Footer />
		</>
	)
}
