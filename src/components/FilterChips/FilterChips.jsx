import {Flex, Tag, TagCloseButton, TagLabel} from "@chakra-ui/react";

const FilterChips = ({ popularTags, onChipClick }) => {
	if (popularTags?.length === 0) {
		return <p>No Tags</p>;
	}

	return (
		<Flex gap={4} spacing={4}>
			<Flex gap={2}>
				{popularTags?.map((tag) => (
					<Tag
						size="md"
						key={tag}
						variant="solid"
						colorScheme="blue"
						onClick={() => onChipClick(tag)}
					>
						<TagLabel>{tag}</TagLabel>
						<TagCloseButton />
					</Tag>
				))}
			</Flex>
			<a href="#" onClick={()=> onChipClick("")}> Reset Tags </a>
		</Flex>
	);
};

export default FilterChips;