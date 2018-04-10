import React from 'react';
import {connect} from 'react-redux';
import {Button, Table, Page, Checkbox, Toast} from 'nr';

import config from '../../config/config'

import functions from '../../asset/js/functions';
import api from '../../asset/js/api';

import styles from '../../asset/scss/GM/GM-list.scss';

import {updateGMConnectList} from '../../store/action';

class GMConnectList extends React.Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await this.getGMConnectList();
    }

    async getGMConnectList() {
        const res = await functions.request(api.GM.GMConnectList);
        const list = res.data;
        this.props.updateGMConnectList(list);
    }

    /**
     * @description 全选
     */
    toCheckAll() {
        const _this = this, GMList = this.props.state.GMList || [];

        GMList.map((item, index) => {
            _this["checkbox" + index].setChecked(this.checkAll.isChecked());
        })
    }

    /**
     * @description 根据数据创建表格DOM
     *
     * @param data 数据
     * @param type 创建数据的类型
     */
    createTableDom(data) {

        const title = [
            {data: [<span key={"GM-product-name"} className={styles["GM-product-name"]}>商品名</span>]},
            {data: [<span key={"GM-pid"} className={styles["GM-pid"]}>商品ID</span>]},
            {data: [<span key={"GM-sid"} className={styles["GM-sid"]}>规格ID</span>]},
            {data: [<span key={"GM-price"} className={styles["GM-price"]}>价格</span>]},
            {data: [<span key={"GM-price"} className={styles["GM-price"]}>是否合并下单</span>]},
            {data: [<span key={"GM-status"} className={styles["GM-status"]}>状态</span>]},
        ];

        return {
            title,
            rows: data.map((tr, index) => [
                {
                    data: [<span key={"category-name-" + index}
                                 className={styles["table-category-name"]}>{tr.itemName}</span>]
                },
                {
                    data: [<span key={"category-name-" + index}
                                 className={styles["table-category-name"]}>{tr.productId}</span>]
                },
                {
                    data: [<span key={"category-name-" + index}
                                 className={styles["table-category-name"]}>{tr.skuId}</span>]
                },
                {
                    data: [<span key={"category-name-" + index}
                                 className={styles["table-category-name"]}>{tr.salePrice}</span>]
                },
                {
                    data: [<span key={"category-name-" + index}
                                 className={styles["table-category-name"]}>1</span>]
                },
                {
                    data: [<span key={"category-name-" + index}
                                 className={styles["table-category-name"]}>0</span>]
                },
            ])
        }
    }

    async goConnectCart() {
        this.goConnectCartBtn.startLoading();
        const res = await functions.request(api.GM.smartOrder, {
            method: "POST",
        });

        if (res.status === 1) {

            Toast.success('下单成功');
        }
        this.goConnectCartBtn.endLoading();
    }

    goGMSetOrderParam() {
        this.props.history.push({
            pathname: config.common.breadcrumb.GM.GMSetOrderParam,
        })
    }

    render() {

        const list = this.props.state.GMConnectList || [];

        return <div className={styles['GM-product-container']}>

            <div className={styles['ctr-buttons']}>
                <div className={styles['go-connect-btn']}>
                    <Button ref={e => this.goConnectCartBtn = e} nRef="goConnectCartBtn" text="合并下单"
                            onClick={this.goConnectCart.bind(this)}/>
                </div>

                <div className={styles['go-set-btn']}>
                    <Button ref={e => this.goSetBtn = e} nRef="goSetBtn" text="设置下单参数"
                            onClick={this.goGMSetOrderParam.bind(this)}/>
                </div>
            </div>

            <div className={styles["GM-list-container"]}>
                <Table data={this.createTableDom(list)}/>
            </div>

            <div className={styles['page-container']}>
                <Page ref={e => this.pages = e} onChange={this.getGMConnectList.bind(this)}/>
            </div>

        </div>

    }

}

const mapStateToProps = (state, ownProps) => {
    return {state: state}
};


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateGMConnectList: (args) => dispatch(updateGMConnectList(args))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(GMConnectList);