import React from 'react';
import {connect} from 'react-redux';
import {Button, Table, Page, Checkbox, Toast} from 'nr';

import config from '../../config/config'

import functions from '../../asset/js/functions';
import api from '../../asset/js/api';

import styles from '../../asset/scss/GM/GM-list.scss';

import {updateGMList} from '../../store/action';

class GM extends React.Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await this.getGMList();
    }

    async getGMList(page) {
        const res = await functions.request(api.GM.GMGetList, {
            body: {page}
        });
        const {list, pages} = res.data;

        this.props.updateGMList(list);
        this.pages.setPageData(pages.page, pages.totalPage);
    }

    goAddProduct() {
        this.props.history.push({
            pathname: config.common.breadcrumb.GM.GMAddProduct,
        })
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
            {
                data: [
                    <span key='checkAllContainer' className={styles["table-checkbox"]}>
                        <Checkbox ref={e => this.checkAll = e} key="checkAll" name="checkAll" value="-1"
                                  onChange={this.toCheckAll.bind(this)}/>
                    </span>
                ]
            },
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
                    data: [
                        <span key={'checkboxContainer' + index} className={styles["table-checkbox"]}>
                            <Checkbox key={"checkbox" + index} name="checkbox" value={tr._id}
                                      ref={e => this["checkbox" + index] = e}/>
                        </span>
                    ]
                },
                {
                    data: [<span key={"category-name-" + index}
                                 onClick={this.enterEditProduct.bind(this, tr.id)}
                                 className={styles["table-category-name"]}>{tr.productName}</span>]
                },
                {
                    data: [<span key={"category-name-" + index}
                                 onClick={this.enterEditProduct.bind(this, tr.id)}
                                 className={styles["table-category-name"]}>{tr.pid}</span>]
                },
                {
                    data: [<span key={"category-name-" + index}
                                 onClick={this.enterEditProduct.bind(this, tr.id)}
                                 className={styles["table-category-name"]}>{tr.sid}</span>]
                },
                {
                    data: [<span key={"category-name-" + index}
                                 onClick={this.enterEditProduct.bind(this, tr.id)}
                                 className={styles["table-category-name"]}>{tr.price}</span>]
                },
                {
                    data: [<span key={"category-name-" + index}
                                 onClick={this.enterEditProduct.bind(this, tr.id)}
                                 className={styles["table-category-name"]}>{tr.status}</span>]
                },
                {
                    data: [<span key={"category-name-" + index}
                                 onClick={this.enterEditProduct.bind(this, tr.id)}
                                 className={styles["table-category-name"]}>{tr.step}</span>]
                },
            ])
        }
    }

    enterEditProduct() {

    }

    async addToConnectCart() {
        const _this = this, GMList = this.props.state.GMList || [];
        let connectIds = [];

        for (let i = 0; i < GMList.length; i++) {
            let checkboxItem = _this["checkbox" + i];
            checkboxItem.isChecked() && connectIds.push(checkboxItem.val());
        }

        const res = await functions.request(api.GM.addToConnectCart, {
            method: "POST",
            body: {connectIds}
        });

        if (res.status === 1) {
            Toast.success('添加成功');
        }
    }

    async goConnectCart() {
        this.props.history.push({
            pathname: config.common.breadcrumb.GM.GMConnectList,
        })
    }

    render() {

        const list = this.props.state.GMList || [];

        return <div className={styles['GM-product-container']}>

            <div className={styles['ctr-buttons']}>
                <div className={styles['add-product-btn']}>
                    <Button ref={e => this.addProductBtn = e} nRef="addProductBtn" text="+添加监听商品信息"
                            onClick={this.goAddProduct.bind(this)}/>
                </div>

                <div className={styles['connect-btn']}>
                    <Button ref={e => this.connectBtn = e} nRef="connectBtn" text="添加到合并下单"
                            onClick={this.addToConnectCart.bind(this)}/>
                </div>

                <div className={styles['go-connect-btn']}>
                    <Button ref={e => this.goConnectCartBtn = e} nRef="goConnectCartBtn" text="前往合并下单"
                            onClick={this.goConnectCart.bind(this)}/>
                </div>
            </div>

            <div className={styles["GM-list-container"]}>
                <Table data={this.createTableDom(list)}/>
            </div>

            <div className={styles['page-container']}>
                <Page ref={e => this.pages = e} onChange={this.getGMList.bind(this)}/>
            </div>

        </div>

    }

}

const mapStateToProps = (state, ownProps) => {
    return {state: state}
};


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateGMList: (args) => dispatch(updateGMList(args))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(GM);