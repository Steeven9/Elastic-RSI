export const getAll = () => {
    type: 'GET_ALL'
}

export const setDrawer = (payload) => ({
    type: 'SET_DRAWER',
    payload,
});

export const setTab = (payload) => ({
    type: 'SET_TAB',
    payload,
});