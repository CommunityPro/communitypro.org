import React from "react"

import { Faqs } from "./data"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"

export const Faq = () => {
	return (
		<div className="flex w-full flex-col">
			<Accordion type="multiple" className="w-full">
				{Faqs.slice(0, 5).map((faq, id) => (
					<AccordionItem key={id} value={faq.question}>
						<AccordionTrigger>{faq.question}</AccordionTrigger>
						<AccordionContent>{faq.answer}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	)
}
