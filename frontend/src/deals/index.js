import React from 'react'
import {useSelector} from 'react-redux'
import {DatePicker, Collapse} from 'antd'
import Container from '../common/components/Container'
import {endOfToday, startOfToday} from '../common/functions/dates'
import DealsItems from './DealsItems'


const Deals = ({backgroundColor}) => {

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
        <Collapse defaultActiveKey={['1']} style={{width: '600px'}}>
          <Collapse.Panel header="Without sell price" key="1">
            <DealsItems items={items.unrecognized}/>
          </Collapse.Panel>
          <Collapse.Panel header="Profitable to resell" key="2">
            <DealsItems items={items.profitable}/>
          </Collapse.Panel>
          <Collapse.Panel header="Rest" key="3">
            <DealsItems items={items.rest}/>
          </Collapse.Panel>
        </Collapse>
      </Container>
  )
}

export default Deals