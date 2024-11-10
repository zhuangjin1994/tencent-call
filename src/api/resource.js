import service from '@/utils/services';

// 管理员新增配额
export function addResource(params) {
  return service.post('/resource/add', params, {
    action: '新增配额',
  });
}

// 内部资源列表
export function queryResourceList(params) {
  return service.post('/resource/queryPage', params, {
    action: '查询资源管理',
  });
}

// 供应商资源列表
export function querySupplierList(params) {
  return service.post('/supplier/queryPage', params, {
    action: '查询资源管理',
  });
}


export function auditResource(params) {
  return service.post('/resource/resourceAudit', params, {
    action: '审批配额',
  });
}

export function queryAllDepartments() {
  return service.get('/resource/queryAllDepartmentName', {
    action: '获取部门',
  });
}

export function getPreparationHours(params) {
  return service.post('/resource/queryEcho', params, {
    action: '获取编制时长',
  });
}

export function getResourceDetail(params) {
  return service.post('/resource/useDetails', params, {
    action: '获取资源详情',
  });
}


// 获取内部资源配置详情
export function getInsideDetail(params) {
  return service.post('/resource/configureDetails', params, {
    action: '获取内部资源配置详情',
  });
}

// 获取内部资源使用详情？
export function getInsideUseDetail(params) {
  return service.post('/resource/costDetails', params, {
    action: '获取内部资源使用详情',
  });
}


// 获取供应商配置详情
export function getSuperDetail(params) {
  return service.post('/supplierResource/configureDetails', params, {
    action: '获取供应商配置详情',
  });
}

// 获取供应商使用详情？
export function getSuperUseDetail(params) {
  return service.post('/supplierResource/costDetails', params, {
    action: '获取供应商使用详情',
  });
}

export function changeSupplierStatus(params) {
  return service.post('/supplier/supplierStatus', params, {
    action: '启用供应商',
  });
}


