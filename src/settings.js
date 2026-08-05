const permission = import.meta.env.VITE_PERMISSION  // 区分是供应连true还是智慧供销false
export const title = permission == "true" ? "联营商应用" : "大投应用";
/**
 * @type {boolean} true | false
 * @description Whether fix the header
 */
export const fixedHeader = false;

/**
 * @type {boolean} true | false
 * @description Whether show the logo in sidebar
 */
export const sidebarLogo = true;
