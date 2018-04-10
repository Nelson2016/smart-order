let reducers = (state, action) => {
    switch (action.type) {
        case "changeLoginStatus":
            return Object.assign({}, state, action.data);
        case "changeGMLoginStatus":
            return Object.assign({}, state, action.data);
        case "updateGMList":
            return Object.assign({}, state, {
                GMList: action.data
            });
        case "updateGMConnectList":
            return Object.assign({}, state, {
                GMConnectList: action.data
            });
        case "updateGMInitOrderParam":
            return Object.assign({}, state, {
                GMInitOrderData: action.data
            });
        default :
            return state;
    }
};

export default reducers;