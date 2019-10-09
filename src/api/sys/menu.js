import request from '../../utils/request';

export const getMenuTree = (params) => {
    return request({
        url: 'api/menu/select_menu_tree',
        method: 'GET',
        params: params
    })
}
