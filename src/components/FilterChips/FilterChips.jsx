import { Tag, TagLabel, TagCloseButton, HStack } from "@chakra-ui/react";

const FilterChips = ({ popularTopics, onChipClick }) => {
	return (
		<HStack spacing={4} mt={2} ml={3}>
			<div>{popularTopics.map((tag) => (
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
      </div>
      <a href="#" onClick={()=> onChipClick("")}> Reset Tags </a>
		</HStack>
	);
};

export default FilterChips;
