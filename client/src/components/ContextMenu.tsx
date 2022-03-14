import { ControlledMenu, MenuItem, MenuState } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { FC } from "react";

interface Props {
  anchorPoint: { x: number; y: number };
  menuProps: {
    state?: MenuState | undefined;
    endTransition: () => void;
  };
  toggleMenu: (open?: boolean | undefined) => void;
}

const ContextMenu: FC<Props> = ({ anchorPoint, menuProps, toggleMenu }) => {
  const handleClose = () => {
    toggleMenu(false);
  };

  return (
    <ControlledMenu
      {...menuProps}
      anchorPoint={anchorPoint}
      onClose={handleClose}
    >
      <MenuItem>Hello</MenuItem>
      <MenuItem>World</MenuItem>
    </ControlledMenu>
  );
};

export default ContextMenu;
