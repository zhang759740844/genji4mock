const MockError = {
  // 添加MockData 失败
  NEED_INTERFACENAME_OR_DATA: {
    code: -201,
    message: '新增Mock接口需要填写接口名称和数据'
  },
  // 缺少 bool 类型参数
  NEED_BOOL_STATE: {
    code: -202,
    message: '需要传入布尔值'
  },
  // Mock 以及 实际 都不存在该接口
  NO_SUCH_INTERFACE: {
    code: -203,
    message: '不存在该接口'
  }
}

module.exports = MockError
