import {Space} from "antd";
import React from "react";

const Container = ({children}) => (
    <Space style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textTransform: 'capitalize'}}>
      {children}
    </Space>
)

export default Container