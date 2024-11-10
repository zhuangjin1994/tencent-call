import service from '@/utils/services';


// 内部资源配置列表（资源配置）
export function queryInside(params) {
  return service.post('/resource/configList', params, {
    action: '内部资源配置列表',
  });
}

// 供应商资源配置列表（资源配置）
export function querySuper(params) {
  return service.post('/supplierResource/configList', params, {
    action: '供应商资源配置列表',
  });
}

// 超管内部资源配置审批列表
export function adminInside(params) {
  return service.post('/resource/adminAuditList', params, {
    action: '超管内部资源列表',
  });
}


// 超管供应商资源配置审批列表
export function adminSuper(params) {
  return service.post('/supplierResource/adminAuditList', params, {
    action: '超管供应商列表',
  });
}


export function queryAccounts(params) {
  return service.post('/accountManagement/queryDemandUserPage', params, {
    action: '查询内部账号',
  });
}

export function querySupplierAccounts(params) {
  return service.post('/accountManagement/querySupplierPageList', params, {
    action: '查询供应商账号',
  });
}

export function querySupplierList(params) {
  return service.post('/accountManagement/querySupplierList', params, {
    action: '获取所属供应商',
  });
}

export function querySupplierAccountList(params) {
  return service.post('/accountManagement/querySupplierAccountList', params, {
    action: '查询供应商账号',
  });
}

export function changeAccountStatus(params) {
  return service.post('/accountManagement/demanderDeleted', params, {
    action: '状态切换',
  });
}

export function changeSupplierAccountStatus(params) {
  return service.post('/accountManagement/supplierDeleted', params, {
    action: '供应商状态切换',
  });
}

export function addSupplierAccount(params) {
  return service.post('/accountManagement/supplierAdd', params, {
    action: '新增供应商账号',
  });
}

export function editAccount(params) {
  return service.post('/accountManagement/demanderEdit', params, {
    action: '编辑账号',
  });
}

export function editSupplierAccount(params) {
  return service.post('/accountManagement/supplierAccountEdit', params, {
    action: '编辑供应商账号',
  });
}

export function deleteAccount(params) {
  return service.post('/accountManagement/demanderShow', params, {
    action: '删除账号',
  });
}

export function deleteSupplierAccount(params) {
  return service.post('/accountManagement/supplierShow', params, {
    action: '删除供应商账号',
  });
}

export function querySelectSupplierAccount(params) {
  return service.get('/accountManagement/queryUsableAddSupplier', {
    action: '获取供应商账号',
  });
}

export function getDepartment(params) {
  return service.post('/resource/queryDepartment', params, {
    action: '获取部门名称',
  });
}

// 超管内部审批
export function insideAuditBatch(params) {
  return service.post('/resource/auditBatch', params, {
    action: '批量审批',
  });
}

// 超管供应商审批
export function superAuditBatch(params) {
  return service.post('/supplierResource/auditBatch', params, {
    action: '批量审批',
  });
}


