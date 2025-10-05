import useDebounce from "@/hooks/useDebounce";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/index"
import { useEffect, useState } from "react";
import Category from "./Category";
import { Input } from "./ui/input";


export default function Hero() {
	const [query, setQuery] = useState("")
	const debouncedQuery = useDebounce(query, 500)
	const navigate = useNavigate({ from: Route.fullPath })
	const params = Route.useSearch()


	useEffect(() => {

		if (params.q !== undefined && params.q !== query) {
			setQuery(params.q)
		}

		if (params.q === undefined && query !== "") {
			setQuery("")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.q])

	useEffect(() => {
		navigate({ search: prev => ({ ...prev, q: debouncedQuery, page: undefined }) })
	}, [debouncedQuery, navigate])

	return (
		<section className="flex flex-col items-center justify-center text-center gap-6 p-4">
			<p className="text-sm bg-indigo-200 text-indigo-500 font-medium px-4 py-2 rounded-full">Latest News</p>
			<h1 className="text-6xl font-semibold">Discover our latest news</h1>
			<p className="text-base text-gray-500 antialiased">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas asperiores unde ducimus velit fugiat voluptate aperiam quam laborum ut ea.</p>

			<div className="flex gap-4 w-lg">
				<Input type="text" placeholder="Search articles" className="w-full" value={query} onChange={e => setQuery(e.target.value)} />
				<Category />
			</div>
		</section>
	)
};
