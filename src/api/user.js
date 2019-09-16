import request from '../utils/request';

export const getUser = (params) => {
    return request({
        url: 'api/user/select_user',
        method: 'GET',
        params: params
    })
}

export const updateUser = (params) => {
    return request({
        url: 'api/user/update_user',
        method: 'PUT',
        data: params
    })
}

export const deleteUser = (params) => {
    return request({
        url: 'api/user/delete_user',
        method: 'DELETE',
        params: params
    })
}

export const batchDeleteUser = (params) => {
    return request({
        url: 'api/user/batch_delete_user',
        method: 'DELETE',
        params: params
    })
}
