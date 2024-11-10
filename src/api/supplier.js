import service from '@/utils/services';

// 新增供应商配置
export function addSupplierConfig(params) {
  return service.post('/supplierResource/add', params, {
    action: '新增供应商配置',
  });
}

// 新增内部配置
export function addInsideConfig(params) {
  return service.post('/resource/add', params, {
    action: '新增内部配置',
  });
}


// 内部配置编辑
export function editInsideConfig(params) {
  return service.post('/resource/editNew', params, {
    action: '编辑内部配置',
  });
}


// 内部配置详情
export function insideConfigDetail(params) {
  return service.post('/resource/addDetails', params, {
    action: '内部配置详情',
  });
}
// 供应商配置详情
export function superConfigDetail(params) {
  return service.post('/supplierResource/addDetails', params, {
    action: '供应商配置详情',
  });
}


// 内部配置详情(编辑回显)
export function insideConfigDetailEdit(params) {
  return service.post('/resource/editInfo', params, {
    action: '内部配置详情',
  });
}
// 供应商配置详情(编辑回显)
export function superConfigDetailEdit(params) {
  return service.post('/supplierResource/editInfo', params, {
    action: '供应商配置详情',
  });
}


// 供应商配置编辑
export function editSuperConfig(params) {
  return service.post('/supplierResource/edit', params, {
    action: '编辑供应商配置',
  });
}

// 部门列表
export function dpartmentList(params) {
  return service.post('/resource/queryDepartment', params, {
    action: '部门列表',
  });
}

// 供应商列表
export function superList(params) {
  return service.post('/supplier/querySupplierList', params, {
    action: '供应商列表',
  });
}

// 供应商列表
export function getSuperListApi(params) {
  return service.post('/supplier/querySupplierList', params, {
    action: '供应商列表',
  });
}


export function addSupplier(params) {
  return service.post('/supplier/add', params, {
    action: '新增供应商',
  });
}

export function editSupplier(params) {
  return service.post('/supplier/edit', params, {
    action: '编辑供应商',
  });
}

export function auditSupplier(params) {
  return service.post('/supplier/supplierAudit', params, {
    action: '审批供应商',
  });
}

export function querySupplier(params) {
  return service.post('/supplier/queryPage', params, {
    action: '获取供应商',
  });
}

export function changeSupplierStatus(params) {
  return service.post('/supplier/supplierStatus', params, {
    action: '切换供应商状态',
  });
}

// 获取供应商审批回显（审批应用）
export function getSupplierInfo(params) {
  return service.post('/supplier/queryEcho', params, {
    action: '获取供应商信息',
  });
}

// 获取供应商附件回显（编辑应用）
export function getSupplierAttachment(params) {
  return service.post('/supplier/queryAllByBusinessIdAndAttachmentType', params, {
    action: '获取供应商信息',
  });
}


// 超管内部配置详情
export function superConfigInsideDetail(params) {
  return service.post('/resource/addDetails', params, {
    action: '内部配置详情',
  });
}


// 超管审批内部资源内部详情
export function adminAuditInsideDetail(params) {
  return service.post('/resource/audit', params, {
    action: '超管审批内部资源详情',
  });
}


// 超管审批供应商资源供应商详情
export function adminAuditDetail(params) {
  return service.post('/supplierResource/audit', params, {
    action: '超管审批供应商资源详情',
  });
}
