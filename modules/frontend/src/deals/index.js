import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {DatePicker, Spin} from 'antd'
import dayjs from 'dayjs'
import {getDeals} from './slice'
import Container from '../common/components/Container'
import DealsItems from './DealsItems'

const Deals = ({backgroundColor}) => {
  const dispatch = useDispatch()

  const dealsStatus = useSelector(state => state.deals.status)
  const items = useSelector(state => state.deals.items)
  const dateRange = useSelector(state => state.deals.dateRange)

  return (
      <Container
          padded
          column
          backgroundColor={backgroundColor}
          stretchItems
      >
        <Container>
          <DatePicker.RangePicker
              value={[dayjs(dateRange.from), dayjs(dateRange.to)]}
              onChange={([dateFrom, dateTo]) => {
                const from = dateFrom.toDate().toISOString();
                const to = dateTo.toDate().toISOString()
                if (dateRange.from !== from || dateRange.to !== to) {
                  dispatch(getDeals({from, to}))
                }
              }}
              showTime
          />
        </Container>
        {dealsStatus === 'loading' &&
            <Container>
              <Spin size="large" style={{padding: '40px'}}/>
            </Container>
        }
        {dealsStatus === 'succeeded' &&
            <DealsItems items={items}/>
        }
      </Container>
  )
}

export default Deals