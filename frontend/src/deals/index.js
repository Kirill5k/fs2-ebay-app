import React from 'react'
import dayjs from 'dayjs'
import {DatePicker} from 'antd'
import Container from '../common/components/Container'

const Deals = ({backgroundColor}) => {

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
            onChange={(v) => console.log(v.map(d => d.format()))}
            showTime
        />
        <p>Deals page content</p>
      </Container>
  )
}

export default Deals