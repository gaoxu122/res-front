import request from '../utils/request';

export const login = (params) => {
    return request({
        url: 'api/login/login_in',
        method: 'post',
        data: params
    })
}


export const registered = (params) => {
    return request({
        url: 'api/login/registered',
        method: 'POST',
        data: params
    })
}
