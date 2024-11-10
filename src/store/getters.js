const getters = {
  token: state => state.user.token,
  userName: state => state.user.userName,
  userId: state => state.user.userId,
  roles: state => state.user.roles,
  departmentName: state => state.user.departmentName,
  departmentId: state => state.user.departmentId,
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  department: state => state.department.list,
  opened: (state) => {
    if (state.app.opened === 'false') {
      return false;
    } if (state.app.opened === 'true') {
      return true;
    }
  },
  msgIsShow: state => state.app.msgIsShow,
  messages: state => state.app.messages,
};
export default getters;
