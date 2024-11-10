const DemandTabsEnum = [
  { label: '全部', key: 'all' },
  { label: '审批中', key: 'approving' },
  { label: '待响应', key: 'to_be_responsed' },
  { label: '待确认', key: 'to_be_confirmed' },
  { label: '待验收', key: 'to_be_accepted' },
  { label: '已完成', key: 'finished' },
];

const DemandStatusEnum = {
  approving: '审批中',
  to_be_responsed: '未响应',
  to_be_confirmed: '已响应',
  to_be_accepted: '待验收',
  finished: '已完成', /* 正常流程下的已完成 */
  end: '已完成', /* 手动结束的已完成 */
};

// tabs合并多个状态为进行中
const DemandTabStatusEnum = {
  approving: '审批中',
  to_be_responsed: '进行中',
  to_be_confirmed: '进行中',
  to_be_accepted: '进行中',
  finished: '进行中',
  end: '已完成',

  // 草稿箱需求状态
  whithdraw: '撤回',
  temporary_storage: '暂存',
  reject: '驳回',
};

// 草稿箱需求状态
const DraftsStatusEnum = {
  whithdraw: '撤回',
  temporary_storage: '暂存',
  reject: '驳回',
};


const CheckStatusEnum = {
  approving: '待审批',
  finished: '已通过',
  reject: '已驳回',
};


// 内部资源审批状态
const insideStatusEnum = {
  approved: '已通过',
  approving: '待审批',
  rejected: '已驳回',
};


// 专家状态
const ExpertStatusEnum = {
  unchoose: '已响应',
  going: '已选择',
  checked: '待验收',
  accepted: '已完成',
};

// 战略发展部门下固定小组
const strategyGroup = [
  'CSIG小分队-医疗',
  'CSIG小分队-其他',
  'PCG小分队',
  'IEG小分队',
  '投资2-Alex小分队',
  '投资小分队',
  '金融小分队',
  'AMS&SR小分队',
  'WXG小分队',
  'TEG小分队',
  '碳中和小分队',
  'SSV小分队',
  'Eurp小分队',
  'MKT小分队',
];

// 资源管理状态
const ResourceStatus = {
  '': '全部',
  0: '审批中',
  1: '已通过',
  2: '未通过',
};

// 额度状态
// const QuotaStatus = {
//   all:'全部',
//   normal: '正常',
//   insufficient: '余量不足'
// }

const QuotaStatusMap = {
  '': '全部',
  0: '余量不足',
  1: '正常',
};

const QuotaStatus = [
  { name: '全部', value: '' },
  { name: '余量不足', value: 0 },
  { name: '正常', value: 1 },
];

// 审批状态
const statusList = [
  { name: '全部', id: '' },
  { name: '待审批', id: 'approving' },
  { name: '已通过', id: 'approved' },
  { name: '已驳回', id: 'rejected' },
];


// 需求方专家验收状态
const AcceptStatus = {
  going: '进行中',
  checked: '待验收',
  accepted: '已完成',
};

// 供应商审批状态
const supplierStatus = {
  0: '审批中', // 超管 审批详情  普通 详情
  2: '已驳回', // 无按钮
  1: '已审批', // 超管：编辑详情
};

// 账号角色
const Roles = {
  demander: '需求方',
  auditor: '审批人',
  coAdministrator: '普通管理员',
  suAdministrator: '超级管理员',
  supplier: '供应商',
};
// 智库-申请状态
const TalentApplyState = {
  approved: '已审批',
  unapproved: '未审批',
};

// 智库-审批状态
const TalentAuditState = {
  pass: '通过',
  reject: '驳回',
};

// 内部账号-员工类型
const userTypes = [
  '合作伙伴',
  '顾问',
  '短期劳务工',
  '实习',
  '外包',
  '毕业生',
  '正式',
];

module.exports = {
  DemandTabsEnum,
  DemandStatusEnum,
  DraftsStatusEnum,
  DemandTabStatusEnum,
  strategyGroup,
  ResourceStatus,
  insideStatusEnum,
  QuotaStatusMap,
  QuotaStatus,
  statusList,
  AcceptStatus,
  supplierStatus,
  Roles,
  CheckStatusEnum,
  TalentApplyState,
  TalentAuditState,
  ExpertStatusEnum,
  userTypes,
};
