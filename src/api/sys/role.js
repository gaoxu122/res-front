import request from '../../utils/request';

export const getRole = (params) => {
    return request({
        url: 'api/role/select_role',
        method: 'GET',
        params: params
    })
}

export const insertRole = (params) => {
    return request({
        url: 'api/role/insert_role',
        method: 'POST',
        data: params
    })
}

export const updateRole = (params) => {
    return request({
        url: 'api/role/update_role',
        method: 'POST',
        data: params
    })
}
