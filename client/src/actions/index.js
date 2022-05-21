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

export const setCountryFilter = (payload) => ({
    type: 'SET_COUNTRY_FILTER',
    payload,
});

export const setRegionFilter = (payload) => ({
    type: 'SET_REGION_FILTER',
    payload,
});