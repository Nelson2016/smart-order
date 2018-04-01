import React from 'react';
import {Form, Input, Button, Toast} from 'nr';

import styles from '../../asset/scss/GM/GM-add-product.scss';

import config from '../../config/config'

import api from '../../asset/js/api';
import functions from '../../asset/js/functions';

class GMAddProduct extends React.Component {

    constructor(props) {
        super(props);
    }

    async getProductInfo() {
        const pid = this.pid.val(),
            sid = this.sid.val();

        if (!pid || !sid) {
            Toast.error('请输入商品ID和规格ID');
            return;
        }

        const result = await functions.request(api.GM.getProductInfoByPidSid, {
            method: "GET",
            body: {
                pid: pid,
                sid: sid
            }
        });

        if (result.status === 1) {
            this.productName.val(result.data.prdName);
        } else {
            Toast.error(result.message);
        }
    }

    async addProduct(canSubmit) {
        const pid = this.pid.val(),
            sid = this.sid.val(),
            productName = this.productName.val(),
            price = this.price.val();

        if (canSubmit) {
            const result = await functions.request(api.GM.GMAddProduct, {
                method: "POST",
                body: {
                    pid,
                    sid,
                    productName,
                    price
                }
            });

            if (result.status === 1) {
                Toast.success('监听成功');
                setTimeout(() => {
                    this.props.history.push({
                        pathname: config.common.breadcrumb.GM.GM,
                    })
                }, 1000)
            }
        }
    }

    render() {
        return <div className={styles['add-product-container']}>
            <Form onSubmit={this.addProduct.bind(this)} ctx={this}>
                <Input ref={e => this.pid = e} nRef="pid" label="商&nbsp;品&nbsp;I&nbsp;D&nbsp;"
                       placeholder="请输入商品ID" dataType="text"/>
                <Input ref={e => this.sid = e} nRef="sid" label="规&nbsp;格&nbsp;I&nbsp;D&nbsp;"
                       placeholder="请输入规格ID" dataType="text"/>

                <div className={styles['product-name-row']}>
                    <div className={styles['product-name-input']}>
                        <Input ref={e => this.productName = e} nRef="productName" label="商品名称"
                               placeholder="请输入商品名称" type="text" readOnly={true}/>
                    </div>

                    <div className={styles['get-product-name-btn']}>
                        <Button ref={e => this.getProductNameBtn = e}
                                nRef="getProductNameBtn"
                                text="获取商品名称 "
                                type="button"
                                onClick={this.getProductInfo.bind(this)}/>
                    </div>
                </div>

                <Input ref={e => this.price = e} nRef="price" label="购买价格"
                       placeholder="请输入购买价格" type="number"/>

                <Button ref={e => this.addProductBtn = e} nRef="addProductBtn" text="添加监听商品 " type="submit"/>
            </Form>
        </div>
    }

}

export default GMAddProduct;