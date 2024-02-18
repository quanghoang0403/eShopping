import { BranchPurchaseLoginPage } from "./renew-branch-package.page";

const route = [
  {
    key: "app.branch.purchase",
    position: 0,
    path: "/branch-purchase",
    name: "BranchPurchase",
    isMenu: false,
    exact: true,
    auth: false,
    //permission: "public",
    component: BranchPurchaseLoginPage,
    child: [],
  },
];
export default route;
