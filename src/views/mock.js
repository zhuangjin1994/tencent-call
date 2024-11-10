const ideaList = [
  {
    id: 1,
    name: '我是需求1',
    description: '这是一个描述这是一个描述这是一个描述这是一个描述',
    action: '访谈',
    children: [
      {
        id: '001-1',
        time: '2021-02-13',
        fileName: '附件列表1',
        supplier: '供应商1',
      },
      {
        id: '001-2',
        time: '2021-02-14',
        fileName: '附件列表2',
        supplier: '供应商2',
      },
      {
        id: '001-3',
        time: '2021-02-33',
        fileName: '附件列表3',
        supplier: '供应商3',
      },
    ],
  },
  {
    id: 2,
    name: '我是需求2',
    description:
      '这是一个描述2这是一个描述2这是一个描述2这是一个描述2这是一个描述2',
    action: '访谈',
    children: [
      {
        id: '002-1',
        time: '2021-02-13',
        fileName: '附件列表4',
        supplier: '供应商1',
      },
      {
        id: '002-2',
        time: '2021-02-14',
        fileName: '附件列表5',
        supplier: '供应商2',
      },
    ],
  },
  {
    id: 3,
    name: '我是需求3',
    description: '这是一个描述3',
    action: '访谈',
    children: [
      {
        id: '003-1',
        time: '2021-02-13',
        fileName: '附件列表6',
        supplier: '供应商1',
      },
    ],
  },
  {
    id: 4,
    name: '我是需求4',
    description: '这是一个描述4',
    action: '访谈',
    children: [
      {
        id: '004-1',
        time: '2021-02-13',
        fileName: '附件列表7',
        supplier: '供应商1',
      },
    ],
  },
  {
    id: 5,
    name: '我是需求5',
    description: '这是一个描述5',
    action: '访谈',
    children: [
      {
        id: '005-1',
        time: '2021-02-13',
        fileName: '附件列表8',
        supplier: '供应商1',
      },
    ],
  },
];

const projectList = [
  {
    name: '我是一个很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的名称',
    id: '100001',
    branch: '交付管理部',
    needer: '赵小刚',
    member: '小张',
    startTime: '2021-9-02',
    status: '已结束',
    type: '响应/访谈',
    remark: '这是一个简易的描述',

  },
  {
    name: '张三',
    id: '100002',
    branch: '交付管理部',
    needer: '赵小刚',
    time: '2121-10-12',
    startTime: '2021-9-02',
    member: '小李',
    status: '已结束',
    progress: 25,
    type: '响应/访谈',
    remark: '这是一个简易的描述',
  },
  {
    name: '张三',
    id: '100003',
    branch: '交付管理部',
    needer: '赵小刚',
    time: '2121-10-12',
    member: '小王',
    startTime: '2021-9-02',
    status: '已结束',
    type: '响应/访谈',
    progress: 50,
    remark: '这是一个简易的描述',
  },
  {
    name: '张三',
    id: '100004',
    branch: '交付管理部',
    needer: '赵小刚',
    type: '响应/访谈',
    member: '张晓刚',
    time: '2121-10-12',
    startTime: '2021-9-02',
    status: '已结束',
    progress: 25,
    remark: '这是一个简易的描述',
  },
  {
    name: '张三',
    id: '100005',
    branch: '交付管理部',
    needer: '赵小刚',
    member: '小刚',
    time: '2121-10-12',
    startTime: '2021-9-02',
    status: '已结束',
    progress: 75,
    remark: '这是一个简易的描述',
  },
  {
    name: '张三',
    id: '100006',
    branch: '交付管理部',
    needer: '赵小刚',
    time: '2121-10-12',
    member: '小赵',
    startTime: '2021-9-02',
    status: '已结束',
    progress: 25,
    remark: '这是一个简易的描述',
  },
  {
    name: '张三',
    id: '100007',
    branch: '交付管理部',
    type: '响应/访谈',
    needer: '赵小刚',
    time: '2121-10-12',
    member: '小小',
    startTime: '2021-9-02',
    status: '已结束',
    progress: 100,
    remark: '这是一个简易的描述',
  },
];

const auditlist = [
  {
    id: '1001',
    description: '这是一个描述',
    demanderName: '赵小刚',
    department: '交付管理部',
    beginDate: '2021-12-23',
    status: '审批中',
  },
  {
    id: '1002',
    description: '这是一个描述',
    demanderName: '赵小刚',
    department: '交付管理部',
    beginDate: '2021-12-23',
    status: '审批中',
  },
  {
    id: '1001',
    description: '这是一个描述',
    demanderName: '赵小刚',
    department: '交付管理部',
    beginDate: '2021-12-23',
    status: '审批中',
  },
];

const resourceList = [
  {
    resourceId: '01',
    departmentName: '交付管理部',
    time: 40,
    costHours: 10,
    remainHours: 30,
    status: '正常',
    quatoStatus: '正常',
  },
  {
    resourceId: '02',
    departmentName: '交付管理部',
    time: 40,
    costHours: 10,
    remainHours: 30,
    status: '正常',
    quatoStatus: '余量不足',
  },
];

const resourceDetail = [
  {
    resourceId: '01',
    demandName: '需求名称1',
    supplier: '供应商1',
    time: 10,
  },
  {
    resourceId: '02',
    demandName: '需求名称2',
    supplier: '供应商2',
    time: 10,
  },
  {
    resourceId: '03',
    demandName: '需求名称3',
    supplier: '供应商3',
    time: 10,
  },
  {
    resourceId: '04',
    demandName: '需求名称4',
    supplier: '供应商4',
    time: 10,
  },
];

const departmentList = [
  { id: 1, name: '战略发展部门' },
  { id: 2, name: '发展部门01' },
  { id: 3, name: '发展部门02' },
];

const demandGroupList = [
  { id: 2, name: 'XX小组1' },
  { id: 3, name: 'XX小组2' },
];

const accountList = [
  {
    id: '10001',
    cnName: '张三',
    departmentName: '交付管理部',
    roleName: '需求人员',
    status: '已开启',
    email: '10000022@163.com',
  },
  {
    id: '10002',
    cnName: '张三',
    departmentName: '交付管理部',
    roleName: '需求人员',
    status: '已关闭',
    email: '10000022@163.com',
  },
];

const logList = [
  {
    operationNum: '10001',
    operationDate: '2019-10-23',
    ipAddr: '192.34.43.102',
    operationPerson: '张三',
    operationModule: '需求列表',
    type: '编辑',
  },
  {
    operationNum: '10002',
    operationDate: '2019-10-23',
    ipAddr: '192.34.43.102',
    operationPerson: '张三',
    operationModule: '审批列表',
    type: '删除',
  },
];

const talentList = [
  { demandId: '1001', demandName: '这是名称', description: '这是一个很长很长很长很长很长很长的描述' },
  { demandId: '1001', demandName: '这是名称', description: '这是一个很长很长很长很长很长很长的描述' },
  { demandId: '1001', demandName: '这是名称', description: '这是一个很长很长很长很长很长很长的描述' },
  { demandId: '1001', demandName: '这是名称', description: '这是一个很长很长很长很长很长很长的描述' },
  { demandId: '1001', demandName: '这是名称', description: '这是一个很长很长很长很长很长很长的描述' },
  { demandId: '1001', demandName: '这是名称', description: '这是一个很长很长很长很长很长很长的描述' },
  { demandId: '1001', demandName: '这是名称', description: '这是一个很长很长很长很长很长很长的描述' },
  { demandId: '1001', demandName: '这是名称', description: '这是一个很长很长很长很长很长很长的描述' },
  { demandId: '1001', demandName: '这是名称', description: '这是一个很长很长很长很长很长很长的描述' },
  { demandId: '1001', demandName: '这是名称', description: '这是一个很长很长很长很长很长很长的描述' },
];

const expertList = [
  { expertName: '专家甲', fileNamw: '附件名字1', updateTime: '2021-12-23' },
  { expertName: '专家乙', fileNamw: '附件名字2', updateTime: '2021-12-23' },
  { expertName: '专家丙', fileNamw: '附件名字3', updateTime: '2021-12-23' },
  { expertName: '专家丁', fileNamw: '附件名字4', updateTime: '2021-12-23' },
  { expertName: '专家甲', fileNamw: '附件名字1', updateTime: '2021-12-23' },
  { expertName: '专家乙', fileNamw: '附件名字2', updateTime: '2021-12-23' },
];

const treeOptions = [
  {
    id: 'company',
    label: '父 🏢',
    children: [{
      id: 'team-i',
      label: '父_子1 👥',
      children: [{
        id: 'person-a',
        label: '父_子1_孙1👱',
      }, {
        id: 'person-b',
        label: '父_子1_孙2👱',
      }],
    }, {
      id: '父_子2',
      label: '父_子2👥',
      children: [{
        id: 'person-c',
        label: '父_子2_孙1👳',
      }, {
        id: 'person-d',
        label: '父_子2_孙2👧',
      }],
    }, {
      id: 'person-e',
      label: '父_子3',
    }],
  },
];

export {
  ideaList,
  projectList,
  auditlist,
  resourceList,
  resourceDetail,
  departmentList,
  demandGroupList,
  accountList,
  logList,
  talentList,
  expertList,
  treeOptions,
};
