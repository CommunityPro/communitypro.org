import Image from "next/image"
import Link from "next/link"
import React from "react"

import { FooterLinks, SocialLinks } from "./data"
import styles from "./footer.module.scss"
import Logo from "@/assets/logo.png"
import { Flex } from "../flex"
import { Text } from "../text"

export const Footer = () => {
	return (
		<footer className={styles.Footer}>
			<Flex.Column className={styles.FooterContainer}>
				<Flex className={styles.FooterContent}>
					<Flex.Column gap={24} className={styles.FooterImage}>
						<Flex className={styles.Image}>
							<Image src={Logo} alt="communitypro" fill sizes="(max-width:1024px)100%" />
						</Flex>
						<Flex gap={16}>
							{SocialLinks.map((link, id) => (
								<a key={id} href={link.href} target="_blank" className="">
									<link.icon size={20} weight="fill" />
								</a>
							))}
						</Flex>
					</Flex.Column>
					<Flex className={styles.FooterLinks}>
						{FooterLinks.map(({ label, links }) => (
							<Flex.Column key={label} className={styles.Links}>
								<Text className={styles.LinkLabel}>{label}</Text>
								<Flex.Column gap={8}>
									{links.map(({ href, name }) => (
										<Link key={href} href={href} className={styles.LinkHref}>
											{name}
										</Link>
									))}
								</Flex.Column>
							</Flex.Column>
						))}
					</Flex>
				</Flex>
			</Flex.Column>
			<Flex className={styles.FooterNote}>
				<Flex className={styles.FooterNoteContent}>
					<Text size="sm" weight={300}>
						&copy;{new Date().getFullYear()} Community Project. All rights reserved
					</Text>
				</Flex>
			</Flex>
		</footer>
	)
}
