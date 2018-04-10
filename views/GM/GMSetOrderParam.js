import React from 'react';
import {connect} from 'react-redux';
import {Button, Table, Title, Checkbox, Toast} from 'nr';


import config from '../../config/config'

import api from '../../asset/js/api';
import functions from '../../asset/js/functions';


import {updateGMInitOrderParam} from '../../store/action';

class GMSetOrderParam extends React.Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.getConfig();

    }

    /**
     * @description 获取下单参数
     * @returns {Promise.<void>}
     */
    async getConfig() {
        const res = await functions.request(api.GM.GMInitOrderData);
        this.props.updateGMInitOrderParam(res.data);
    }

    async setAddress(addressId) {
        const res = await functions.request(api.GM.GMSetDefaultAddress, {
            method: "POST",
            body: {
                addressId
            }
        });

        if (res.status === 1) {
            this.getConfig();
        } else {
            Toast.error(res.message);
        }
    }

    /**
     * @description 根据数据创建表格DOM
     *
     * @param data 数据
     * @param type 创建数据的类型
     */
    createTableDom(data) {

        const title = [
            {data: [<span key={"GM-product-name"}>收件人</span>]},
            {data: [<span key={"GM-pid"}>收件人手机号</span>]},
            {data: [<span key={"GM-sid"}>收件地址</span>]},
            {data: [<span key={"GM-set"}>操作</span>]},
        ];

        return {
            title,
            rows: data.map((tr, index) => [
                {
                    data: [<span key={"category-name-" + index}>{tr.name}</span>]
                },
                {
                    data: [<span key={"category-name-" + index}>{tr.mobileNumber}</span>]
                },
                {
                    data: [<span key={"category-name-" + index}>{tr.address.detailedAddress}</span>]
                },
                {
                    data: [<span key={"category-name-" + index}>
                        {!tr.selected && <Button text="设为收件地址"
                                                 onClick={this.setAddress.bind(this, tr.owerId)}/>}
                    </span>]
                },
            ])
        }
    }

    render() {

        const data = this.props.state.GMInitOrderData || [];

        const address = data.consig ? data.consig.consigneeInfos : []

        return <div>

            <Title title='设置收货地址'/>
            <Table data={this.createTableDom(address)}/>

        </div>
    }

}

const mapStateToProps = (state, ownProps) => {
    return {state: state}
};


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateGMInitOrderParam: (args) => dispatch(updateGMInitOrderParam(args))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(GMSetOrderParam);