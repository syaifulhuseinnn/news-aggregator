import ArticleCard from '@/components/ArticleCard'
import { api } from '@/configs/axios'
import type { Articles } from '@/types/articles.interface'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, stripSearchParams } from '@tanstack/react-router'
import { z } from 'zod'
import { Loader } from "lucide-react"
import { PaginationArticles } from '@/components/Pagination'
import Hero from '@/components/Hero'

export const Route = createFileRoute('/')({
	validateSearch: z.object({
		category: z.string().optional().default("*"),
		q: z.string().optional().default(""),
		page: z.number().min(1).optional().default(1),
		limit: z.number().min(10).max(50).default(10),
	}),
	search: {
		middlewares: [stripSearchParams({ page: 1, limit: 10, category: "*", q: "" })],
	},
	component: App,
})

function App() {
	const params = Route.useSearch()
	const navigate = useNavigate({ from: Route.fullPath })
	const { page, q, category, limit } = params

	const { data, isFetching, isError } = useQuery({
		queryKey: ['articles', page, q, category, limit],
		queryFn: async () => {
			const { data } = await api.get<Articles>('/articles', {
				params: {
					search: q,
					category: category === "*" ? undefined : category,
					page,
					limit
				}
			})

			return data
		},
		staleTime: 60_000
	})

	const handlePagination = (targetPage: number) => {
		navigate({
			search: prev => {
				// remove `page` when it's 1 to keep the URL clean
				if (targetPage === 1) {
					const { page, ...rest } = prev as any
					return rest
				}
				return { ...prev, page: targetPage }
			}
		})
	}

	const total = data?.total ?? 0;
	// const maxPage = Math.max(1, Math.ceil(total / 10));

	return (
		<>
			<Hero />

			{isFetching && <div className='min-h-screen flex flex-col items-center justify-center'><Loader className='animate-spin' /></div>}

			{isError && <div>Something went wrong</div>}

			{data && data.items.length > 0 ? (
				<section className="grid grid-cols-3 gap-y-24 gap-x-6 my-10">
					{data?.items.map(article => (
						<ArticleCard key={article._id} {...article} />
					))}
				</section>
			) : (
				<p className='text-center'>Articles not found</p>
			)}

			<PaginationArticles
				page={page}
				limit={limit}
				total={total}
				onChange={(targetPage) => handlePagination(targetPage)}
			/>
		</>
	)
}
