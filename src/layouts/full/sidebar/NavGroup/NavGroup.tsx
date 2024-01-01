import React from "react";
import PropTypes from "prop-types";
import { ListSubheader, styled, Theme, List } from "@mui/material";

type NavGroup = {
  navlabel?: boolean;
  subheader?: string;
  items?: ItemType[]; // Include the 'items' property conditionally
};

interface ItemType {
  disabled?: boolean;
  external?: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: React.ElementType;
  href?: any;
  items?: ItemType[]; // Include the 'items' property conditionally

  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const ListSubheaderStyle = styled((props: Theme | any) => (
  <ListSubheader disableSticky {...props}>
    <span> {props.subheader}</span>
  </ListSubheader>
))(({ theme }) => ({
  ...theme.typography.overline,
  fontWeight: "700",
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(0),
  color: theme.palette.text.primary,
  lineHeight: "26px",
  padding: "3px 12px",
  display: "flex", // Add this style to create a flex container
  alignItems: "center", // Align items vertically at the center
}));

const NavGroup = ({ item }: { item: NavGroup }) => {
  return (
    <>
      <ListSubheaderStyle subheader={item.subheader}></ListSubheaderStyle>
    </>
  );
};

NavGroup.propTypes = {
  item: PropTypes.shape({
    navlabel: PropTypes.bool,
    subheader: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        navlabel: PropTypes.bool,
        subheader: PropTypes.string,
        title: PropTypes.string,
        icon: PropTypes.elementType,
        href: PropTypes.any,
        onClick: PropTypes.func,
      })
    ),
  }),
};

export default NavGroup;
