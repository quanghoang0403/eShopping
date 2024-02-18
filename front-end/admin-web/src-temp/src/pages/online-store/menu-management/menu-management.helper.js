import { Hyperlink } from "constants/hyperlink.constants";
import { getFlatDataFromTree } from "react-sortable-tree";

export const  menuManagementHelper = {
   checkIsValidFormMenuItems : (treeData) => {
    const flatListNode = getFlatDataFromTree({ treeData: treeData, getNodeKey: ({ treeIndex }) => treeIndex });
    for (let i = 0; i < flatListNode?.length; i++) {
      const node = flatListNode[i].node;
      if (!node.name) {
        return false;
      }
      if (!node.hyperlinkOption) {
        return false;
      }
      if (node.hyperlinkOption === Hyperlink.URL && !node.url) {
        return false;
      }
      if (node.hyperlinkOption === Hyperlink.CATEGORY && !node.categoryId) {
        return false;
      }
      if (node.hyperlinkOption === Hyperlink.PRODUCT_DETAIL && !node.productId) {
        return false;
      }
      if (node.hyperlinkOption === Hyperlink.MY_PAGES && !node.pageId) {
        return false;
      }
      if (node.hyperlinkOption === Hyperlink.BLOG_DETAIL && !node.blogId) {
        return false;
      }
    }
    return true;
  }
}