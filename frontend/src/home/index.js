import React from 'react'
import dayjs from 'dayjs'
import {DatePicker} from 'antd'
import Container from '../common/components/Container'

const Home = ({backgroundColor}) => {

  const now = dayjs()
  const startOfDay = now.startOf('day')
  const endOfDay = now.endOf('day')

  return (
      <Container
          column
          style={{
            padding: '24px 24px',
            background: backgroundColor
          }}>
        <DatePicker.RangePicker
            defaultValue={[startOfDay, endOfDay]}
            onChange={(v) => console.log(v)}
            showTime
        />
        <p>Home page content</p>
      </Container>
  )
}

export default Home