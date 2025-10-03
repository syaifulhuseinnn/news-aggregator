import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"

type Props = {
	page: number
	limit: number
	total: number
	onChange: (page: number) => void
}

function buildPageList(current: number, max: number) {
	if (max <= 7) {
		return Array.from({ length: max }, (_, i) => i + 1)
	}

	const pages: (number | '...')[] = []

	// always include 1
	pages.push(1)

	// include a small window around current
	const left = Math.max(2, current - 1)
	const right = Math.min(max - 1, current + 1)

	if (left > 2) pages.push('...')

	for (let p = left; p <= right; p++) {
		pages.push(p)
	}

	if (right < max - 1) pages.push('...')

	// always include last
	pages.push(max)

	return pages
}

export function PaginationArticles({ page, limit, total, onChange }: Props) {
	const maxPage = Math.max(1, Math.ceil(total / limit))
	const pages = buildPageList(page, maxPage)

	const go = (target: number) => {
		const t = Math.max(1, Math.min(maxPage, Math.floor(target)))
		if (t !== page) onChange(t)
	}

	return (
		<Pagination className="mt-20">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={(e: any) => {
							e.preventDefault()
							go(page - 1)
						}}
						aria-disabled={page <= 1}
					/>
				</PaginationItem>

				{pages.map((p, i) =>
					p === '...' ? (
						<PaginationItem key={`e-${i}`}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						<PaginationItem key={p}>
							<PaginationLink
								href="#"
								isActive={p === page}
								onClick={(e: any) => {
									e.preventDefault()
									go(p)
								}}
							>
								{p}
							</PaginationLink>
						</PaginationItem>
					)
				)}

				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={(e: any) => {
							e.preventDefault()
							go(page + 1)
						}}
						aria-disabled={page >= maxPage}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
}
