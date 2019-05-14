import host from './host'
export default {
  ...host,
  userUrl: {
    register: '/user/register',
    login: '/user/login',
    getUserInfo: '/user/userinfo',
    changeDomain: '/user/change-domain'
  },
  mockUrl: {
    mockList: '/mock/mock-list',
    switchMock: '/mock/switch-mock',
    mockInfo: '/mock/mock-info',
    swithYAPI: '/mock/switch-yapi',
    updateMock: '/mock/update-mock',
    deleteMock: '/mock/delete-mock',
    deleteAll: '/mock/delete-all',
    closeAll: '/mock/close-all'
  }
}
