import {
  Box,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  FormLabel,
  Select,
  DrawerFooter,
  Icon,
  // useToast - will use when user tested and upload successful
} from "@chakra-ui/react";
// import { SettingsIcon } from "@chakra-ui/icons";
import SelectTags from "../SubmissionForm/SelectTags"; 
import TopicFilter from "./TopicFilter";
import { ChevronDownIcon } from "@chakra-ui/icons";
import uploadIcon from "../../assets/icons/upload-folder-svgrepo-com.png";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./FilterDrawer.scss";
import filterBy from "../../assets/icons/filter-by.svg";

export default function FilterDrawer({ onFilterChange }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [filters, setFilters] = useState({
    tags: [],
    discipline: "",
    type: "",
    level: "",
    estDuration: "",
  });

  const [selectedTags, setSelectedTags] = useState([]);

  const [selectColors, setSelectColors] = useState({
    tags: "black",
    discipline: "black",
    type: "black",
    level: "black",
    estDuration: "black",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));

    setSelectColors((prevColors) => ({
      ...prevColors,
      [name]: value ? "grey" : "black",
    }));
  };

  const handleFilterChange = (event) => {
    if (location.pathname !== "/resource") {
      navigate("/resource");
    }
    if (typeof onFilterChange === "function") {
      event.preventDefault();
      const tagValues = selectedTags.map(tag => tag.value);
      console.log("Selected Tags:", tagValues);
      onFilterChange({
        ...filters,
        tags: tagValues,
      });
      setSelectColors({
        tags: selectedTags.length > 0 ? "grey" : "black",
        discipline: filters.discipline ? "grey" : "black",
        type: filters.type ? "grey" : "black",
        level: filters.level ? "grey" : "black",
        estDuration: filters.estDuration ? "grey" : "black",
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setFilters({
      tags: [],
      discipline: "",
      type: "",
      level: "",
      estDuration: "",
    });
    setSelectedTags([]); 
    setSelectColors({
      tags: "black",
      discipline: "black",
      type: "black",
      level: "black",
      estDuration: "black",
    });
    onFilterChange({
      tags: ["All"],
      discipline: "All",
      type: "All",
      level: "All",
      estDuration: "All",
    });
    onClose();
  };

  return (
    <>
      <button className="filter__button" onClick={onOpen}>
        {/* <SettingsIcon boxSize="1.15rem" className="filter__icon" /> */}
        {/* <Icon as={SettingsIcon} className="filter__icon" />
         */}
        <img src={filterBy} alt="filter icon" className="filter__icon" />
        <p className="filter__button-name">Filter by</p>
      </button>
      <div>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={handleCancel}
          size="sm"
        >
          <DrawerOverlay />
          <DrawerContent
            sx={{
              borderRadius: "30px 0px 0px 30px",
              border: "4px solid black",
            }}
          >
            <DrawerCloseButton
              sx={{ color: "#0099FF", fontSize: "20px", fontWeight: "bolder" }}
            />
            <DrawerHeader>
              <h1 className="submission__header-title">Advanced</h1>
              <h1 className="submission__header-title">Filters</h1>
              <h3 className="subtitle">Narrow your search results</h3>
            </DrawerHeader>
            <DrawerBody className="submission__form-container">
           
           {/* SelectTags */}
            <Box mt={8}>
                <TopicFilter onChange={handleChange}
                  selectedOptions={selectedTags}
                  setSelectedOptions={setSelectedTags}
                />
              </Box>

              <Select
                id="discipline"
                name="discipline"
                placeholder="Discipline"
                value={filters.discipline}
                onChange={handleChange}
                _hover={{}}
                fontSize="1.5rem"
                icon={<ChevronDownIcon />}
                iconSize="45px"
                iconColor="#0099FF"
                border="none"
                boxShadow="none"
                className="submission__inputField"
                color={selectColors.discipline}
                marginTop="8"
                focusBorderColor="#000000"
                _focus={{
                  border: "3px solid black",
                  boxShadow: "0px 4px 5px -2px black",
                }}
                sx={{
                  "& option": {
                    color: "black",
                    backgroundColor: "white",
                  },
                  "& option:first-of-type": {
                    color: "grey",
                  },
                }}
              >
                <option value="All" disabled>
                Select Discipline
                </option>

                <option value="Software Engineering">
                  Software Engineering
                </option>
                <option value="UX/UI Design">UX/UI Design</option>
                <option value="Product">Product</option>
                <option value="Data Science">Data Science</option>
              </Select>

              <Select
                id="type"
                name="type"
                placeholder="Type"
                value={filters.type}
                onChange={handleChange}
                _hover={{}}
                fontSize="1.5rem"
                icon={<ChevronDownIcon />}
                iconSize="45px"
                iconColor="#0099FF"
                border="none"
                boxShadow="none"
                className="submission__inputField"
                color={selectColors.type}
                marginTop="8"
                focusBorderColor="#000000"
                _focus={{
                  border: "3px solid black",
                  boxShadow: "0px 4px 5px -2px black",
                }}
                sx={{
                  "& option": {
                    color: "black",
                    backgroundColor: "white",
                  },
                  "& option:first-of-type": {
                    color: "grey",
                  },
                }}
              >
                <option value="All" disabled>
                Select Type
                </option>
                <option value="Article">Article</option>
                <option value="Blog">Blog</option>
                <option value="Course">Course</option>
                <option value="Video">Video</option>
                <option value="All">All</option>
              </Select>

              <Select
                id="level"
                name="level"
                placeholder="Skill Level"
                value={filters.level}
                onChange={handleChange}
                _hover={{}}
                fontSize="1.5rem"
                icon={<ChevronDownIcon />}
                iconSize="45px"
                iconColor="#0099FF"
                marginTop="8"
                border="none"
                boxShadow="none"
                className="submission__inputField"
                color={selectColors.level}
                focusBorderColor="#000000"
                _focus={{
                  border: "3px solid black",
                  boxShadow: "0px 4px 5px -2px black",
                }}
                sx={{
                  "& option": {
                    color: "black",
                    backgroundColor: "white",
                  },
                  "& option:first-of-type": {
                    color: "grey",
                  },
                }}
              >
                <option value="All" disabled>
                Select Skill Level
                </option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All">All</option>
              </Select>

              <Select
                id="estDuration"
                name="estDuration"
                placeholder="Estimated Duration"
                value={filters.estDuration}
                onChange={handleChange}
                _hover={{}}
                icon={<ChevronDownIcon />}
                fontSize="1.5rem"
                iconSize="45px"
                iconColor="#0099FF"
                border="none"
                boxShadow="none"
                className="submission__inputField"
                color={selectColors.estDuration}
                marginTop="8"
                focusBorderColor="#000000"
                _focus={{
                  border: "3px solid black",
                  boxShadow: "0px 4px 5px -2px black",
                }}
                sx={{
                  "& option": {
                    color: "black",
                    backgroundColor: "white",
                  },
                  "& option:first-of-type": {
                    color: "grey",
                  },
                }}
              >
                <option value="All" disabled>
                Select Estimated Duration
                </option>
                <option value="3 min">3 min</option>
                <option value="5 min">5 min</option>
                <option value="7 min">7 min</option>
                <option value="10 min">10 min</option>
                <option value="20 min">20 min</option>
                <option value="30 min">30 min</option>
                <option value="40 min">40 min</option>
                <option value="50 min">50 min</option>
                <option value="60 min">60 min</option>
                <option value="All">All</option>
              </Select>
            </DrawerBody>
            <DrawerFooter>
              <Button
                mr={3}
                bg="white"
                fontSize="18px"
                fontFamily="Poppins"
                padding="6px"
                fontWeight="bold"
                marginTop="20px"
                boxShadow="1px 1px 0px black"
                border="3px solid black"
                color="black"
                _hover={{ bg: "gray.600" }}
                onClick={handleCancel}
                className="submission__form-button"
              >
                Clear
              </Button>
              <Button
                bg="#0099FF"
                fontSize="18px"
                fontWeight="bold"
                fontFamily="Poppins"
                padding="6px"
                marginTop="20px"
                boxShadow="1px 1px 0px black"
                border="3px solid black"
                color="black"
                _hover={{ bg: "gray.600" }}
                className="submission_form-button"
                type="submit"
                onClick={handleFilterChange}
              >
                Search
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
