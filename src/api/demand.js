import service from '@/utils/services';

export function addDemand(params) {
  return service.post('/demand/save', params, {
    action: '新增保存需求',
  });
}

export function submitDemand(params) {
  return service.post('/demand/submitAddInfo', params, {
    action: '新增提交需求',
  });
}

export function addEditDemand(params) {
  return service.post('/demand/saveEditInfo', params, {
    action: '编辑保存需求',
  });
}

export function submitEditDemand(params) {
  return service.post('/demand/submitEditInfo', params, {
    action: '编辑提交需求',
  });
}

export function queryDemandList(params) {
  return service.post('/demand/listDemand', params, {
  // return service.post('/demand/list', params, {
    action: '请求需求列表',
  });
}

export function getCostHours(params) {
  return service.post('/demand/costHoursByDept', params, {
    action: '获取部门消耗时长',
  });
}

export function getDemandEditInfo(params) {
  return service.post('/demand/editInfo', params, {
    action: '编辑需求详情',
  });
}

export function getDemandInfo(params) {
  return service.post('/demand/demandInfo', params, {
    action: '查询需求详情',
  });
}

export function getAttatchmentList(params) {
  return service.post('/demand/attatchmentList', params, {
    action: '查询详情附件',
  });
}

export function shareFiles(params) {
  return service.post('/demand/batchShare', params, {
    action: '附件共享',
  });
}

export function getDeliverList(params) {
  return service.post('/demand/deliverList', params, {
    action: '获取交付信息',
  });
}

export function recallDemand(params) {
  return service.post('/demand/withDraw', params, {
    action: '撤回需求',
  });
}

export function finishDemand(params) {
  return service.post('/demand/finish', params, {
    action: '结束需求',
  });
}

export function activateDemand(params) {
  return service.post('/demand/activate', params, {
    action: '激活需求',
  });
}

export function queryDrafts(params) {
  return service.post('/demand/draftList', params, {
    action: '获取草稿箱列表',
  });
}

export function deleteDemand(params) {
  return service.post('/demand/delete', params, {
    action: '删除需求',
  });
}


export function querySuppliers(params) {
  return service.post('/supplier/enableList', params, {
    action: '查询供应商列表',
  });
}

export function copyDemand(params) {
  return service.post('/demand/copy', params, {
    action: '复制需求',
  });
}

export function getDemandConfirmInfo(params) {
  return service.post('/demand/confirmInfo', params, {
    action: '获取需求确认详情',
  });
}

export function getEchoSupplier(params) {
  return service.post('/demand/echoSupplier', params, {
    action: '获取供应商',
  });
}

export function getEchoExpert(params) {
  return service.post('/demand/expertInfo', params, {
    action: '查询专家详情',
  });
}

export function getTalentExpert(params) {
  return service.post('demand/talentExpertInfo', params, {
    action: '查询智库专家详情',
  });
}

export function confirmChoose(params) {
  return service.post('/demand/confirm', params, {
    action: '需求确认',
  });
}

export function cancelChoose(params) {
  return service.post('/demand/cancelExpert', params, {
    action: '取消选择',
  });
}

export function getMainDemandInfo(params) {
  return service.post('/demand/mainDemandInfo', params, {
    action: '获取需求详情',
  });
}

export function getAcceptInfo(params) {
  return service.post('/demand/acceptInfo', params, {
    action: '查询验收详情',
  });
}

export function demandAccept(params) {
  return service.post('/demand/accept', params, {
    action: '验收',
  });
}

export function demandBatchAccept(params) {
  return service.post('/demand/batchAccept', params, {
    action: '批量验收',
  });
}

export function adjustAccept(params) {
  return service.post('/demand/adjustAccept', params, {
    action: '验收调整',
  });
}

export function expertAppeal(params) {
  return service.post('/demand/expertAppeal', params, {
    action: '申诉',
  });
}

export function getDeptByName(params) {
  return service.post('/demand/getDeptByName', params, {
    action: '查询部门',
  });
}

export function getMember(params) {
  return service.post('/demand/getMember', params, {
    action: '查询项目成员',
  });
}

export function getSuperior(params) {
  return service.post('/demand/getSuperior', params, {
    action: '查询默认上级审批人',
  });
}

export function getHistoryChoice(params) {
  return service.post('/demand/historyChoice', params, {
    action: '获取历史选择',
  });
}

export function getExpertList(params) {
  return service.post('/demand/expertList', params, {
    action: '获取专家列表',
  });
}

export function browseDemand(params) {
  return service.post('/demand/browseDemand', params, {
    action: '需求追踪',
  });
}

// 收藏/置灰专家操作
export function markExpert(params) {
  return service.post('/demand/collectOrHideExpert', params, {
    action: '标记专家信息',
  });
}

export function expertOperation(params) {
  return service.post('/demand/expertOperation', params, {
    action: '获取专家动态',
  });
}


/* ————————————————  审批列表  ———————————————— */

export function queryAuditList(params) {
  return service.post('/demand/auditList', params, {
    action: '查询审批列表',
  });
}

export function auditDemand(params) {
  return service.post('/demand/audit', params, {
    action: '需求审批',
  });
}

export function demandAuditBatch(params) {
  return service.post('/demand/auditBatch', params, {
    action: '批量审批',
  });
}

export function getAuditHistory(params) {
  return service.post('/audit/getHistory', params, {
    action: '获取审批节点',
  });
}

export function getActivities(params) {
  return service.post('/demand/actions', params, {
    action: '获取需求动态',
  });
}


/* ————————————————  日志管理  ———————————————— */

export function queryLogList(params) {
  return service.post('/demand/logList', params, {
    action: '获取日志信息',
  });
}

/* ————————————————  附件操作  ———————————————— */

export function getCosSign() {
  return service.get('/cos/getTempKey', {
    action: '获取密钥',
  });
}

export function previewFile(params) {
  return service.post('/attachment/getPreviewUrl', params, {
    action: '预览附件',
  });
}

export function downloadFile(params) {
  return service.post('/attachment/getDownloadUrl', params, {
    action: '下载附件',
  });
}

export function batchDownloadFile(params) {
  return service.post('/attachment/getDownLoadUrlBatch', params, {
    action: '一键下载',
  });
}

// 查询数据权限
export function getDataPermission(params) {
  return service.post('/demand/filterDataPermission', params, {
    action: '查询数据权限',
  });
}

