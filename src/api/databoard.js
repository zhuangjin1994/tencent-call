import service from '@/utils/services';

export function queryResourceYear(params) {
  return service.post('/dataBoard/resourceYearStatistics', params, {
    action: '查询年度资源',
  });
}

export function queryResourceMonthly(params) {
  return service.post('/dataBoard/monthlyCostHoursConditionForDemand', params, {
  // return service.post('/dataBoard/monthlyCostHoursCondition', params, {
    action: '查询月度资源',
  });
}

export function queryDepartmentCostHours(params) {
  return service.post('/dataBoard/yearlyDepartmentCostHours', params, {
    action: '查询部门月度资源',
  });
}

export function queryTopCostHours(params) {
  return service.post('/dataBoard/topTenCostHoursProposer', params, {
    action: '查询部门排行榜',
  });
}

export function querySupplierCostHours(params) {
  return service.post('/dataBoard/getSupplierCostHours', params, {
    action: '查询供应商资源',
  });
}

export function queryDemandType(params) {
  return service.post('/dataBoard/getDemandTypeStatics', params, {
    action: '查询需求类型',
  });
}

export function queryReportCenter(params) {
  return service.post('/dataBoard/getReportCenterStatics', params, {
    action: '查询报表中心',
  });
}

