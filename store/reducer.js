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
        default :
            return state;
    }
};

export default reducers;