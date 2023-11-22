import {Space} from "antd"
import React from "react"
import './Container.css'

const Container = ({children, style, column, padded, backgroundColor}) => (
    <Space
        className={padded ? 'padded' : ''}
        style={{
          backgroundColor: backgroundColor,
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