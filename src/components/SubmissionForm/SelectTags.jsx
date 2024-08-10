import { Box, FormControl, FormLabel, Icon, position } from "@chakra-ui/react";
import "./SubmissionDrawer.scss";
import { ChevronDownIcon } from "@chakra-ui/icons";
import React, { forwardRef } from "react";
import Select, { components } from "react-select";
import { useForm } from "react-hook-form";


// const animatedComponents = makeAnimated();
const CustomDropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <Icon as={ChevronDownIcon} boxSize={5} />
    </components.DropdownIndicator>
  );
};

const customComponents = {
  DropdownIndicator: CustomDropdownIndicator,
};

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: "373px",
    border: "3px solid black",
    boxShadow: "1px 1px 0 black",
    borderRadius: "5px",
    ":hover": { 
      borderColor: "black",
    },
    "&:focus": { outline: "none" },
  }),

  valueContainer: (provided) => ({
    ...provided,
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    whiteSpace: "nowrap",
    padding: "0px",
    fontSize: "20px",
    color: "black",
    fontWeight: "bold",
    fontFamily: "Poppins",
    marginLeft: "14px",
  }),
  multiValue: (provided) => ({
    ...provided,
    flex: "0 0 auto",
    maxWidth: "400px",
  }),

  indicatorsContainer: (provided) => ({
    ...provided,
    maxWidth: "500px",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,

    color: "#0099FF",
    padding: 0,
    "& svg": {
      position: "relative",
      right: "-5px",
      width: "45px",
      height: "45px",
    },
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "none",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    border: "4px solid black",
    // fontFamily: 'Corben',
    fontWeight: "bold",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "grey",
    fontWeight: "bold",
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    maxWidth: "50px",
  }),
};

const options = [
  { value: "accessibility", label: "Accessibility"},
  { value: "ai", label: "AI" },
  { value: "algorithms", label: "Algorithms"},
  { value: "analytics", label: "Analytics"},
  { value: "angular", label: "Angular" },
  { value: "api", label: "API" },
  { value: "big data", label: "Big Data"},
  { value: "data analysis", label: "Data Analysis"},
  { value: "data-driven design", label: "Data-Driven Design" },
  { value: "data engineering", label: "Data Engineering"},
  { value: "data visualization", label: "Data Visualization"},
  { value: "design thinking", label: "Design Thinking"},
  { value: "design trends", label: "Design Trends"},
  { value: "d3.js", label: "D3.js"},
  { value: "etl", label: "ETL"},
  { value: "figma", label: "Figma"},
  { value: "flexbox/grid", label: "Flexbox/Grid" },
  { value: "inclusive design", label: "Inclusive Design"},
  { value: "javascript", label: "Javascript"},
  { value: "machine learning", label: "Machine Learning"},
  { value: "product management", label: "Product Management" },
  { value: "protoyping", label: "Prototyping"},
  { value: "python", label: "Python"},
  { value: "quality control", label: "Quality Assistance" },
  { value: "react", label: "React" },
  { value: "sketch", label: "Sketch" },
  { value: "software engineering", label: "Software Engineer" },
  { value: "sprint planning", label: "Sprint Planning" },
  { value: "statistics", label: "Statistics"},
  { value: "testing", label: "Testing" },
  { value: "ui design", label: "UI Design"},
  { value: "user flow", label: "User Flow" },
  { value: "user research", label: "User Research"},
  { value: "usibility", label: "Usibility" },
  { value: "ux principles", label: "UX Principles"},
  { value: "ux design", label: "UX Design"},
  { value: "ux/ui design", label: "UX/UI Design" },
  { value: "visual design", label: "Visual Design"},
  { value: "vite", label: "Vite" },
  { value: "wireframes", label: "Wireframes" },
];

const SelectTags = forwardRef(({ selectedOptions, setSelectedOptions }, ref) => {

  return (
        <Select
          closeMenuOnSelect={false}
          components={customComponents}
          isMulti
          value={selectedOptions}
          options={options}
          onChange={(o) => setSelectedOptions(o)}
          isOptionDisabled={() => selectedOptions.length >= 4}
          placeholder="Select 4 tags"
          _placeHolder={{ color: "gray.500"}}
          id="tags"
          name="tags"
          styles={customStyles}
        />
  );
});

export default SelectTags;
