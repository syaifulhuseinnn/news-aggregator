import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { api } from "@/configs/axios"
import { useQuery } from "@tanstack/react-query"
import { Route } from "@/routes/index"
import { capitalizeFirstLetter } from "@/lib/utils"
import { useNavigate } from "@tanstack/react-router"

export default function Category() {
	const navigate = useNavigate({ from: Route.fullPath })
	const params = Route.useSearch()
	const { category } = params

	const { data: categories } = useQuery({
		queryKey: ['categories'],
		queryFn: async () => (await api.get<string[]>('/categories')).data,
		staleTime: 300_000
	})

	const handleChange = (value: string) => {
		navigate({ search: prev => ({ ...prev, category: value === "all" ? "" : value, page: undefined }) })
	}

	return (
		<Select value={category} onValueChange={value => handleChange(value)}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Category" />
			</SelectTrigger>
			<SelectContent className="capitalize">
				<SelectGroup>
					<SelectLabel>Category</SelectLabel>
					<SelectItem value="*">All</SelectItem>
					{categories?.map(category => (
						<SelectItem value={category}>{capitalizeFirstLetter(category)}</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
};
