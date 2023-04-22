import {Space} from "antd";
import React from "react";

const Container = ({children, style, column}) => (
    <Space style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textTransform: 'capitalize',
        flexDirection: column ? 'column' : 'row',
        ...style
    }}>
      {children}
    </Space>
)

export default Container