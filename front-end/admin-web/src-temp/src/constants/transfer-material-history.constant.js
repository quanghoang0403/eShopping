export const EnumTransferMaterialStatus = {
  Draft: 0,
  Inprogress: 10,
  Delivering: 20,
  Completed: 30,
  Canceled: 40,
};

export const EnumTransferMaterialStep = {
  Finish: 'finish',
  Process: 'process',
  Wait: 'wait',
  Error: 'error'
};

export const EnumKeyMenuAction = {
  Edit: 0,
  Cancel: 1,
  Print: 2,
};

export const EnumNextAction = {
  Approve: 0,
  Delivering: 1,
  Complete: 2,
  Cancel: 3,
};

export const EnumTransferMaterialError = {
  None: 0,
  Default: 1,
  NotEnoughQuantity: 2,
};

export const DEFAULT_STEP_SKIP = 10;