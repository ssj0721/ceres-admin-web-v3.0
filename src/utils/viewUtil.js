
import store from "@/store"; // 确保你导入了 Vuex store
export const viewUtil = {
    initView: (vm, funcId, addKeys) => {
        console.log("initView", vm);
        console.log(vm);
        
        vm.permissions = { ...vm.permissions }; // 防止修改原数据
        console.log(store.getters);
        const raw = localStorage.getItem("iRetailPermission");
        const iRetailPermission = JSON.parse(raw || "[]"); // 保证是数组格式
        console.log("VVVVVVVV");
        console.log(iRetailPermission);
        
        
        vm.localPermission = iRetailPermission;
        const permissionMap = {};
        iRetailPermission.forEach(key => {
        permissionMap[key] = true;
        });
        console.log(permissionMap);
        
        Object.assign({}, vm.permissions, {
            query: false,
            add: false,
            del: false,
            edit: false,
            export: false,
            import: false,
            approve: false,
            cancel: false,
        });
         
        vm.permissions.query = permissionMap[funcId + "_query"] || false;
        vm.permissions.add = permissionMap[funcId + "_add"] || false;
        vm.permissions.del = permissionMap[funcId + "_del"] || false;
        vm.permissions.edit = permissionMap[funcId + "_edit"] || false;
        vm.permissions.export = permissionMap[funcId + "_export"] || false;
        vm.permissions.import = permissionMap[funcId + "_import"] || false;
        vm.permissions.approve = permissionMap[funcId + "_approve"] || false;
        vm.permissions.cancel = permissionMap[funcId + "_cancel"] || false;

        console.log("permissions" + vm.permissions);
        

        if (addKeys !== undefined) {
            addKeys = addKeys.split(",");
            addKeys.forEach((item) => {
                // Vue.set(vm.permissions, item, false)
                vm.permissions[item] = permissionMap[funcId + "_" + item] || false;
            });
        }
    }
}

// export default ({ Vue }) => {
//     Vue.prototype.$viewUtil = viewUtil
// }
// 作为全局插件提供
export default {
    install(app) {
      app.config.globalProperties.$viewUtil = viewUtil;
    }
  }
