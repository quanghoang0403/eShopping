export const InventoryHistoryAction = {
  /// <summary>
  /// Create Order
  /// </summary>
  CreateOrder: 0,

  /// <summary>
  /// Edit Order
  /// </summary>
  EditOrder: 1,

  /// <summary>
  /// Cancel Order
  /// </summary>
  CancelOrder: 2,

  /// <summary>
  /// Update Stock
  /// </summary>
  UpdateStock: 3,

  /// <summary>
  /// Import Goods
  /// </summary>
  ImportGoods: 4,

  /// <summary>
  /// Transfer Goods
  /// </summary>
  TransferGoods: 5,

  /// <summary>
  /// Start Shift
  /// </summary>
  StartShift: 6,

  /// <summary>
  /// End Shift
  /// </summary>
  EndShift: 7,

  /// <summary>
  /// End Shift
  /// </summary>
  CreateMaterial: 8,
  DeleteMaterial: 9,
};

export const ListInventoryHistoryAction = [
  {
    id: 0,
    name: "inventoryHistory.actionText.createOrder",
  },
  {
    id: 1,
    name: "inventoryHistory.actionText.editOrder",
  },
  {
    id: 2,
    name: "inventoryHistory.actionText.cancelOrder",
  },
  {
    id: 3,
    name: "inventoryHistory.actionText.updateStock",
  },
  {
    id: 4,
    name: "inventoryHistory.actionText.importGoods",
  },
  {
    id: 5,
    name: "inventoryHistory.actionText.transferGoods",
  },
  {
    id: 6,
    name: "inventoryHistory.actionText.startShift",
  },
  {
    id: 7,
    name: "inventoryHistory.actionText.endShift",
  },
  {
    id: 8,
    name: "inventoryHistory.actionText.createMaterial",
  },
  {
    id: 9,
    name: "inventoryHistory.actionText.deleteMaterial",
  },
];
