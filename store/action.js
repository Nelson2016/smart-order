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

const updateGMListList = (data) => {
    return {
        type: "updateGMList",
        data
    }
};

export {
    changeLoginStatus,
    changeGMLoginStatus,
    updateGMListList
};