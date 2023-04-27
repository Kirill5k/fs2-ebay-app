import React from 'react'
import {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {DatePicker, Spin} from 'antd'
import {getDealsByDate} from './slice'
import Container from '../common/components/Container'
import {endOfToday, startOfToday} from '../common/functions/dates'
import DealsItems from './DealsItems'

const Deals = ({backgroundColor}) => {
  const dispatch = useDispatch()

  const [dateFrom, setDateFrom] = useState(startOfToday());
  const [dateTo, setDateTo] = useState(endOfToday());

  const dealsStatus = useSelector(state => state.deals.status)
  const items = useSelector(state => state.deals.items)

  useEffect(() => {
    const dateRange = {
      from: dateFrom.toDate().toISOString(),
      to: dateTo.toDate().toISOString()
    }
    dispatch(getDealsByDate(dateRange))
  }, [dateFrom, dispatch])

  return (
      <Container
          column
          style={{
            padding: '24px 24px',
            background: backgroundColor
          }}>
        <DatePicker.RangePicker
            value={[dateFrom, dateTo]}
            onChange={([df, dt]) => {
              setDateFrom(df)
              setDateTo(dt)
            }}
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