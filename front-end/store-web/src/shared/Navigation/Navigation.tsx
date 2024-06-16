import React from "react";
import NavigationItem from "./NavigationItem";
import { useAppSelector } from "@/hooks/useRedux";

function Navigation() {
  const menu = useAppSelector((state) => state.common.menu) as INavItemType[]
  return (
    <ul className="nc-Navigation flex items-center">
      {menu.map((item) => (
        <NavigationItem key={item.id} menuItem={item} />
      ))}
    </ul>
  );
}

export default Navigation;
