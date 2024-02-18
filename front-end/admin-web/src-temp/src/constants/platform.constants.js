import {
  AdminAppIcon,
  AdminWebIcon,
  GoFnBAppIcon,
  POSAppIcon,
  POSWebIcon,
  StoreAppIcon,
  StoreWebIcon,
} from "constants/icons.constants";
export const Platform = {
  AdminWebsite: "6C626154-5065-616C-7466-6F7200000000",
  AdminMobileApp: "6C626154-5065-616C-7466-6F7200000001",
  POS: "6C626154-5065-616C-7466-6F7200000002",
  POSApp: "6C626154-5065-616C-7466-6F7200000003",
  StoreWebsite: "6C626154-5065-616C-7466-6F7200000004",
  StoreMobileApp: "6C626154-5065-616C-7466-6F7200000005",
  GoFnBApp: "6C626154-5065-616C-7466-6F7200000009",
};

export const defaultPlatforms = [
  {
    id: "6c626154-5065-616c-7466-6f7200000002",
    name: "POS",
    icon: <POSWebIcon />,
  },
  {
    id: "6c626154-5065-616c-7466-6f7200000009",
    name: "GoF&B App",
    icon: <GoFnBAppIcon />,
  },
  {
    id: "6c626154-5065-616c-7466-6f7200000004",
    name: "Store Web",
    icon: <StoreWebIcon />,
  },
  {
    id: "6c626154-5065-616c-7466-6f7200000005",
    name: "Store App",
    icon: <StoreAppIcon />,
  },
];

export const platformNames = [
  {
    id: "6C626154-5065-616C-7466-6F7200000000",
    name: "Admin Web",
    icon: <AdminWebIcon />,
  },
  {
    id: "6C626154-5065-616C-7466-6F7200000001",
    name: "Admin Mobile",
    icon: <AdminAppIcon />,
  },
  {
    id: "6c626154-5065-616c-7466-6f7200000002",
    name: "POS",
    icon: <POSWebIcon />,
  },
  {
    id: "6C626154-5065-616C-7466-6F7200000003",
    name: "POS App",
    icon: <POSAppIcon />,
  },
  {
    id: "6c626154-5065-616c-7466-6f7200000004",
    name: "Store Web",
    icon: <StoreWebIcon />,
  },
  {
    id: "6c626154-5065-616c-7466-6f7200000005",
    name: "Store App",
    icon: <StoreAppIcon />,
  },
  {
    id: "6c626154-5065-616c-7466-6f7200000009",
    name: "GoF&B App",
    icon: <GoFnBAppIcon />,
  },
];

export const platformList = {
  AdminWeb: "Admin Web",
  AdminMobile: "Admin Mobile",
  POSWeb: "POS",
  POSMobile: "POS App",
  StoreWebsite: "Store Web",
  StoreApp: "Store App",
  GoFnBApp: "GoF&B App",
};

export const otherPlatform = "Other";
