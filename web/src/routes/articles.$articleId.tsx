import { api } from '@/configs/axios'
import type { Item } from '@/types/articles.interface'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { Loader, ArrowUpRight, ArrowLeft } from 'lucide-react'
import DOMPurify from "dompurify";
import { fallbackImageUrl, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'


export const Route = createFileRoute('/articles/$articleId')({
	component: RouteComponent,
})

function RouteComponent() {
	const { articleId } = Route.useParams()
	const router = useRouter()

	const { data, isFetching, isError } = useQuery({
		queryKey: ['article', articleId],
		queryFn: async () => await api.get<Item>(`/articles/${articleId}`).then(res => res.data),
		staleTime: 300_000,
		retry: false,
		enabled: !!articleId
	})

	const safeHtml = DOMPurify.sanitize(data?.content || "");

	if (isFetching) return <div className='min-h-screen flex flex-col items-center justify-center'><Loader className='animate-spin' /></div>
	if (isError) return <div className='min-h-screen flex flex-col items-center justify-center text-xl font-medium'>Article not found</div>

	return (
		<article className='flex flex-col gap-7 items-center justify-center max-w-4xl mx-auto'>
			<Button variant="link" className='self-start underline hover:cursor-pointer' onClick={() => router.history.back()}><ArrowLeft /> Back</Button>
			<div className="flex justify-between items-center gap-4 text-sm">
				<span className='uppercase px-3 py-1 bg-lime-200 rounded-full font-medium text-lime-700'>{data?.source}</span>
				<span className='text-gray-500 font-medium'>{formatDate(data?.publishedAt ?? new Date())}</span>
			</div>
			<h1 className='antialiased text-7xl text-center font-medium'>{data?.title}</h1>
			<h2 className='antialiased text-gray-500 text-center text-base'>{data?.summary}</h2>
			<img src={data?.imageUrl || fallbackImageUrl} alt={data?.title} height={1024} width={768} loading="lazy" className='w-full h-[500px] object-cover object-top' />

			<div className='text-base text-gray-500 leading-loose' dangerouslySetInnerHTML={{ __html: safeHtml }} />

			<Link to={data?.url || ''} target="_blank" className='self-start' rel="noopener noreferrer">
				<Button variant="secondary" className='self-start hover:cursor-pointer'>Original Source <ArrowUpRight /></Button>
			</Link>
		</article>
	)
}
