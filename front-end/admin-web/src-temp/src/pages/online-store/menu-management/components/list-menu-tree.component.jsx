import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { ON_VIEW_MENU_MANAGEMENT } from "constants/level-menu.constants";
import { useDispatch, useSelector } from "react-redux";
import SortableTree from "react-sortable-tree";
import { menuManagementActions, menuManagementSelector } from "store/modules/menu-management/menu-management.reducer";
import { useTranslation } from "react-i18next";
import "./list-menu-tree.style.scss";
import MenuTreeItem from "./menu-tree-item.component";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";

function ListMenuTree(props) {
  const { onView } = props;
  const [t] = useTranslation();
  const isTouchDevice = !!("ontouchstart" in window || navigator.maxTouchPoints);
  const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;
  const dataCreate = useSelector(menuManagementSelector).create.multiLevelMenus;
  const dataUpdate = useSelector(menuManagementSelector).edit.multiLevelMenus;
  const menuData = onView === ON_VIEW_MENU_MANAGEMENT.CREATE ? dataCreate : dataUpdate;
  const dispatch = useDispatch();
  const translatedData = {
    addNewItem: t("menuManagement.menuItem.addNewItem"),
    title: t("menuManagement.menuItem.title"),
  };

  const onDragStateChanged = (e) => {
    if (e?.isDragging) {
      const element = document.getElementById(`level-menu-multi-level__${e?.draggedNode?.id}`);
      if (element) {
        element.style.display = "none";
      }
    } else {
      const elements = document.getElementsByClassName("level-menu-multi-level");
      if (elements?.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.display = "flex";
        }
      }
    }
  };
  const onClickCreateMenu = () => {
    dispatch(menuManagementActions.addUnderRoot({ onView }));
  };

  return (
    <div className="list-menu-tree" id="id-list-menu-tree">
      <span className="list-menu-tree__title">{translatedData.title}</span>
      <div className="sortable-tree-list-menu" id="id-sortable-tree-list-menu">
        <DndProvider backend={dndBackend}>
          <SortableTree
            isVirtualized={false}
            toggleExpandedForAll={true}
            treeData={menuData}
            onChange={(data) => dispatch(menuManagementActions.onChangeByDrag({ treeData: data, onView: onView }))}
            generateNodeProps={(node) => ({
              title: <MenuTreeItem nodeInfo={node} onView={onView} />,
            })}
            scaffoldBlockPxWidth={80}
            maxDepth={10}
            rowHeight={110}
            onDragStateChanged={onDragStateChanged}
          />
        </DndProvider>
      </div>
      <FnbAddNewButton onClick={onClickCreateMenu} text={translatedData.addNewItem} />
    </div>
  );
}

export default ListMenuTree;
