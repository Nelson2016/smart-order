const changeLoginStatus = (data) => {
    return {
        type: "changeLoginStatus",
        data
    }
};

const changeGMLoginStatus = (data) => {
    return {
        type: "changeGMLoginStatus",
        data
    }
};

const updateGMList = (data) => {
    return {
        type: "updateGMList",
        data
    }
};

const updateGMConnectList = (data) => {
    return {
        type: "updateGMConnectList",
        data
    }
};

const updateGMInitOrderParam = (data) => {
    return {
        type: "updateGMInitOrderParam",
        data
    }
};

export {
    changeLoginStatus,
    changeGMLoginStatus,
    updateGMConnectList,
    updateGMList,
    updateGMInitOrderParam
};