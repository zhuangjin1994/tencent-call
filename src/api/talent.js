import service from '@/utils/services';

export function queryTalentList(params) {
  return service.post('/demand/talentList', params, {
    action: '获取智库',
  });
}

export function queryTalentFiles(params) {
  return service.post('/demand/talentAttachMents', params, {
    action: '获取智库附件',
  });
}

// 智库-我的申请
export function queryApplicationList(params) {
  return service.post('/talentAudit/getApplicationList', params, {
    action: '获取申请列表',
  });
}

// 智库-我的审批
export function queryTalentAuditList(params) {
  return service.post('/talentAudit/getAuditList', params, {
    action: '获取审批列表',
  });
}

// 智库审批
export function auditTalent(params) {
  return service.post('/talentAudit/auditTalent', params, {
    action: '操作',
  });
}

// 智库一键审批
export function auditBatchTalent(params) {
  return service.post('/talentAudit/auditTalentBatch', params, {
    action: '一键审批',
  });
}

// 查询附件预览/下载权限
export function getTalentAuth(params) {
  return service.post('/talentAudit/queryTalentAuth', params, {
    action: '获取附件权限',
    hidden: true,
  });
}

// 申请附件权限
export function applyAuthority(params) {
  return service.post('/talentAudit/applyPreviewAndDownloadAuthority', params, {
    action: '申请权限',
  });
}


