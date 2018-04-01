const isDev = process.env.NODE_ENV === 'development';

export default {
    debug: isDev,

    dev: {
        port: 3000,
    },
    prod: {
        port: 8088
    },
    common: {
        breadcrumb: {
            GM: {
                GM: "/GM",
                GMAddProduct: "/GM/GMAddProduct"
            },
            // admin: {
            //     admin: {name: "首页", path: "/admin"},
            //     adminLogin: {name: "管理端登录", path: "/adminLogin"},
            //     welcome: {name: "欢迎页", path: "/admin/welcome"},
            //     siteManagement: {name: "站点管理", path: "/admin/siteManagement"},
            //     modifyPassword: {name: "修改密码", path: "/admin/siteManagement/modifyPassword"},
            //     siteInformation: {name: "站点信息", path: "/admin/siteManagement/siteInformation"},
            //     functionSet: {name: "功能设置", path: "/admin/siteManagement/functionSet"},
            //
            //     contentManagement: {name: "内容管理", path: "/admin/contentManagement"},
            //     articleManagement: {name: "文章管理", path: "/admin/contentManagement/articleManagement"},
            //     articleDetail: {name: "文章详情", path: "/admin/contentManagement/articleManagement/articleDetail"},
            //     commentManagement: {name: "评论管理", path: "/admin/contentManagement/commentManagement"},
            //     categoryManagement: {name: "分类管理", path: "/admin/contentManagement/categoryManagement"},
            //     categoryDetail: {name: "分类详情", path: "/admin/contentManagement/categoryManagement/categoryDetail"},
            //     userManagement: {name: "用户管理", path: "/admin/userManagement/userManagement"},
            //
            //     financialManagement: {name: "财务管理", path: "/admin/financialManagement/financialManagement"},
            //
            //     dataStatistics: {name: "数据统计", path: "/admin/dataStatistics/dataStatistics"}
            // },
            // client: {
            //     clientLogin: {name: "客户端登录", path: "/clientLogin"},
            //     client: {name: "首页", path: "/client"}
            // }
        }
    },
    GM: {
        urls: {
            loginUrl: "https://login.gome.com.cn/login"
        }
    }
}