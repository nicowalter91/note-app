import React from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Typography,
  Input,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Checkbox,
} from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="#9E9E9E"
      className={`${id === open ? "rotate-180" : ""} h-4 w-4 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

function List({ options, color, check }) {
  return (
    <div className="flex !justify-between items-center">
      <Checkbox
        className="hover:before:opacity-0"
        ripple={false}
        defaultChecked={check}
        label={
          <Typography variant="small" color={color} className="font-medium">
            {options[0]}
          </Typography>
        }
        containerProps={{
          className: "-ml-3 py-2",
        }}
      />
      <Typography variant="small" color={color} className="font-medium">
        {options[1]}
      </Typography>
    </div>
  );
}

const DATA = [
  {
    options: ["Social Media Campaigns", "23"],
    color: "blue-gray",
    check: true,
  },
  {
    options: ["SEO Optimization", "15"],
    color: "blue-gray",
    check: true,
  },
  {
    options: ["Content Strategy", "8"],
    color: "gray",
    check: false,
  },
  {
    options: ["Email Marketing", "19"],
    color: "gray",
    check: false,
  },
  {
    options: ["Brand Management", "12"],
    color: "blue-gray",
    check: true,
  },
];

export function Dropdown() {
  const [open, setOpen] = React.useState(1);
  const [isMenuOpen, setIsMenuOpen] = React.useState(true);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <div className="container mx-auto grid place-items-center h-full my-10">
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        placement="top-start"
        dismiss={{
          itemPress: false,
        }}
      >
        <MenuHandler>
          <Button className="text-black-500">Categories</Button>
        </MenuHandler>
        <MenuList className="w-72">
          <div className="p-2 mb-2">
            <div className="outline-none mb-4 flex gap-10 justify-between">
              <button className="font-medium text-gray-600">
                Filter
              </button>
              <button className="text-gray-900 font-medium">
                Clear All
              </button>
            </div>
            <Input
              label="Search"
              icon={<i className="fa fa-search text-gray-400" />}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
            />
          </div>
          <MenuItem>
            <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
              <AccordionHeader
                onClick={() => handleOpen(1)}
                className="py-0 !border-0"
              >
                <Typography
                  variant="small"
                  className="font-medium text-gray-600"
                >
                  Marketing
                </Typography>
              </AccordionHeader>
              <AccordionBody className="!py-1 px-0.5">
                {DATA.map((props, key) => (
                  <List key={key} {...props} />
                ))}
              </AccordionBody>
            </Accordion>
          </MenuItem>
          <MenuItem>
            <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
              <AccordionHeader
                onClick={() => handleOpen(2)}
                className="py-0 !border-0"
              >
                <Typography
                  variant="small"
                  className="font-medium text-gray-600"
                >
                  Product Development
                </Typography>
              </AccordionHeader>
              <AccordionBody>
                <div className="flex !justify-between items-center">
                  <Checkbox
                    className="hover:before:opacity-0"
                    ripple={false}
                    defaultChecked
                    label={
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Marketings
                      </Typography>
                    }
                    containerProps={{
                      className: "-ml-3 py-2",
                    }}
                  />
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    12
                  </Typography>
                </div>
              </AccordionBody>
            </Accordion>
          </MenuItem>
          <MenuItem>
            <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
              <AccordionHeader
                onClick={() => handleOpen(3)}
                className="py-0 !border-0"
              >
                <Typography
                  variant="small"
                  className="font-medium text-gray-600"
                >
                  Customer Support
                </Typography>
              </AccordionHeader>
              <AccordionBody>
                <div className="flex !justify-between items-center">
                  <Checkbox
                    className="hover:before:opacity-0"
                    ripple={false}
                    label={
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Support
                      </Typography>
                    }
                    containerProps={{
                      className: "-ml-3 py-2",
                    }}
                  />
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    20
                  </Typography>
                </div>
              </AccordionBody>
            </Accordion>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}

export default Dropdown;