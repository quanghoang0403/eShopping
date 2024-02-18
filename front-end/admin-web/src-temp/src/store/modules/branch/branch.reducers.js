import actionType from "./branch.type";

const initialState = {};

const branchReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.CREATE_BRANCH_WORKING_HOURS:
      return {
        branchWorkingHours: {
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

export default branchReducer;
