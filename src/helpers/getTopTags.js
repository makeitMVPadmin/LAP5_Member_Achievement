import {useQuery} from "@tanstack/react-query";

export const useGetPopularTagsQuery = (resources, tags) => useQuery({
	queryKey: ['resources', 'tags'],
	queryFn: () => getPopularTags(resources, tags),
});

export const getPopularTags = async (resources, tags) => {
	if (!resources) {
		return [];
	}

	const tagsTally = {};
	for (const tag of tags) {
		for (const resource of resources) {
			for (const resourceTag of resource.tags) {
				if (tag.id === resourceTag) {
					const tagTitle = tag.title;
					const tagsCount = tagsTally[tagTitle]

					if (tagsCount) {
						tagsTally[tagTitle]++;
					} else {
						tagsTally[tagTitle] = 1;
					}
				}
			}
		}
	}

	const popularTags = Object.keys(tagsTally);

	popularTags.sort((a, b) => tagsTally[b] - tagsTally[a])

	return popularTags.slice(0, 4);
}