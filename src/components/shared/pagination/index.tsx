import { ArrowLeft, ArrowRight } from "@phosphor-icons/react"
import classNames from "classnames"
import React from "react"

import { Button } from "@/components/ui/button"
import styles from "./pagination.module.scss"

interface Props {
	current: number
	onPageChange: (page: number) => void
	pageSize: number
	total: number
}

export const Pagination = ({ current, onPageChange, pageSize, total }: Props) => {
	const totalPages = Math.ceil(total / pageSize)

	const onPrevPage = () => {
		if (current > 1) {
			onPageChange(current - 1)
		}
	}

	const onNextPage = () => {
		if (current < totalPages) {
			onPageChange(current + 1)
		}
	}

	const buttons = () => {
		const numbers = []
		for (let index = 1; index <= totalPages; index++) {
			numbers.push(
				<button
					key={index}
					className={classNames([
						styles.PaginationButton,
						styles[`PaginationButton--${current === index}`],
					])}
					onClick={() => onPageChange(index)}>
					{index}
				</button>
			)
		}
		return numbers
	}

	return (
		<div className={styles.Pagination}>
			<Button size="sm" onClick={onPrevPage} disabled={current <= 1}>
				<ArrowLeft />
			</Button>
			<div className={styles.PaginationButtons}>{buttons()}</div>
			<Button size="sm" onClick={onNextPage} disabled={current === totalPages}>
				<ArrowRight />
			</Button>
		</div>
	)
}
