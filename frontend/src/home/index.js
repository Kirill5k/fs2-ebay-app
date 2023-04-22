import React from 'react'
import {DatePicker} from 'antd'
import Container from '../common/components/Container'

const Home = ({backgroundColor}) => {
  return (
      <Container
          column
          style={{
            padding: '24px 24px',
            background: backgroundColor,
          }}>
        <DatePicker.RangePicker showTime/>
        <p>Home page content</p>
      </Container>
  )
}

export default Home