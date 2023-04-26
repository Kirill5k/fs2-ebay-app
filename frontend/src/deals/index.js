import React from 'react'
import {useSelector} from 'react-redux'
import {DatePicker, Spin} from 'antd'
import Container from '../common/components/Container'
import {endOfToday, startOfToday} from '../common/functions/dates'
import DealsItems from './DealsItems'

const Deals = ({backgroundColor}) => {

  const dealsStatus = useSelector(state => state.deals.status)
  const items = useSelector(state => state.deals.items)

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
        {dealsStatus === 'loading' &&
            <Container>
              <Spin size="large" tip="Loading" style={{padding: '40px'}}/>
            </Container>
        }
        {dealsStatus === 'succeeded' &&
            <DealsItems items={items}/>
        }
      </Container>
  )
}

export default Deals