import { fallbackImageUrl, formatDate } from "@/lib/utils";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

interface ArticleCardProps {
	_id: string
	title: string;
	summary: string;
	imageUrl: string;
	publishedAt: Date;
	source: string;
}

export default function ArticleCard({ _id, title, summary, source, publishedAt, imageUrl }: ArticleCardProps) {
	return (
		<div className="rounded-xl flex flex-col gap-4 relative h-[calc(100%+50px)]">
			<img src={imageUrl || fallbackImageUrl} alt={title} className="h-70 w-full object-cover rounded-md" height={1024} width={768} loading="lazy" />
			<div className="flex justify-between text-sm bg-blue-300/60 px-4 py-2">
				<span className="uppercase font-medium">{source}</span>
				<span>{formatDate(publishedAt)}</span>
			</div>
			<h1 className="antialiased font-semibold text-xl">{title}</h1>
			<p className="antialiased text-base text-gray-500">{summary}</p>

			<Link to="/articles/$articleId" params={{ articleId: _id }} className="absolute bottom-0 left-0" >
				<Button className="max-w-fit hover:cursor-pointer">Read article</Button>
			</Link>
		</div>
	)
};
