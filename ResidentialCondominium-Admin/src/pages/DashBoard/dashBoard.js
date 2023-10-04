import React, { useState, useEffect } from 'react';
import "./dashBoard.css";
import {
     Spin,
   BackTop, Breadcrumb
} from 'antd';
import {
    DashboardOutlined, HomeOutlined
} from '@ant-design/icons';

const DashBoard = () => {
    
    return (
        <div>
            <Spin spinning={false}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <DashboardOutlined />
                                <span>DashBoard</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default DashBoard;