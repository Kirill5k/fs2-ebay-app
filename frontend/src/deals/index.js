import React from 'react'
import {DatePicker} from 'antd'
import Container from '../common/components/Container'
import {endOfToday, startOfToday} from '../common/functions/dates'

const Deals = ({backgroundColor}) => {

  return (
      <Container
          column
          style={{
            padding: '24px 24px',
            background: backgroundColor
          }}>
        <DatePicker.RangePicker
            defaultValue={[startOfToday(), endOfToday()]}
            onChange={(v) => console.log(v.map(d => d.toDate().toISOString()))}
            showTime
        />
        <p>Deals page content</p>
      </Container>
  )
}

export default Deals