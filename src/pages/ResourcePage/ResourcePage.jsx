// Deps
// Lib & Helpers
// Components & Styling
import "./ResourcePage.scss";
import NavBar from "../../components/NavBar/NavBar.jsx";
import {Outlet} from "react-router-dom";
import ResourceCard from "../../components/ResourceCard/ResourceCard.jsx";
import {useGetResourcesQuery} from "../../api/index.js";
import {useGetPopularTagsQuery} from "../../helpers/getTopTags.js";
import FilterChips from "../../components/FilterChips/FilterChips.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import {useState} from "react";
import {Box, Flex} from "@chakra-ui/react";

// currentUser should be global state. That's okay when dealing with session stuffs
export default function ResourcePage({ currentUser, tags }) {
  const [search, setSearch] = useState("");
  const [selectedChip, setSelectedChip] = useState("");

  // we need the selected chip
  // const includesSelectedChip = selectedChip === "" || resource.tags.includes(selectedChip)
  
  const { data: resources } = useGetResourcesQuery(currentUser.id);
  const { data: topFiveTags } = useGetPopularTagsQuery(resources ?? [], tags);

  return (
    <Flex gap={4} px={2} overflowY="hidden">
      <Flex direction="column" minW={240} position="fixed" height="calc(100vh - 70px)">
        {/* Move to App.jsx to reduce redundancy */}
        <NavBar
          // onCategoryChange={setCategory}
          // onFormSubmit={(newResource) =>
          //   setResources([...resources, newResource])
          // }
          // onFilterChange={handleFilterChange}
          currentUser={currentUser}
        />
      </Flex>

      <Box flexGrow={1} pl={260} height="calc(100vh - 70px)">
        <Flex pb={2} direction="column" gap={1}>
          <SearchBar searchTerm={search} onSearch={setSearch}/>
          <FilterChips popularTags={topFiveTags}/>
        </Flex>

        <Flex gap={2}>
          <Box className="resource__cards" maxW={300} minW={300}>
            {/* Give resourceList access to the store, and pass in a filter function? */}
            <section className="resourceList" aria-label="Resource List">
              <Flex direction="column" gap={2} role="list" pb={30}>
                {resources?.length > 0 ? (
                  resources?.map((resource) => {
                    return (
                      <ResourceCard
                        key={resource.id}
                        id={resource.id}
                        resource={resource}
                        url={`/resource/${resource.id}`}
                      />
                    );
                  })
                ) : (
                  <p>No resources available for this category.</p>
                )}
              </Flex>
            </section>
          </Box>
          <Box width="100%">
            {/* This is a slot for the details card that shows up on the right in the Resource Library */}
            <Outlet />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
