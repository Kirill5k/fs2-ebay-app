import {Card, Collapse, Descriptions, List, Tag} from 'antd'
import './DealsItems.css'

const ItemName = ({index, name}) => (
    <span style={{width: '100%'}}>
      <span>{name}</span>
      <Tag bordered={false} style={{float: 'right'}}>{index}</Tag>
    </span>
)

const DealsItemList = ({items}) => {

  const itemDescription = (i, item) => [
    { key: `name-${i}`, label: 'Name', children: <ItemName name={item.name} index={i}/> },
    { key: `listing-title-${i}`, label: 'Listing Title', children: item.title },
    { key: `price-${i}`, label: 'Price', children: `£${item.buyPrice} (Buy) ${item.exchangePrice ? `/ £${item.exchangePrice} (Sell)` : ''}` },
  ]

  return (
      <div className="deals-item-list">
        <List
            dataSource={Array.from(items.items.entries())}
            renderItem={([i, item]) => (
                <Card
                    key={item.url}
                    className="deals-item"
                    hoverable
                    onClick={() => window.open(item.url, "_blank")}
                >
                  <Descriptions column={1} items={itemDescription(i, item)}/>
                </Card>
            )}
        />
      </div>
  )
}

const DealsItems = ({items}) => (
    <Collapse
        className="deals-items"
        defaultActiveKey="1"
        accordion
        ghost
    >
      <Collapse.Panel
          header="Without sell price"
          extra={<Tag>{items.unrecognized.total}</Tag>}
          key="1"
      >
        <DealsItemList items={items.unrecognized}/>
      </Collapse.Panel>
      <Collapse.Panel
          header="Profitable to resell"
          extra={<Tag>{items.profitable.total}</Tag>}
          key="2"
      >
        <DealsItemList items={items.profitable}/>
      </Collapse.Panel>
      <Collapse.Panel
          header="Remaining"
          extra={<Tag>{items.rest.total}</Tag>}
          key="3"
      >
        <DealsItemList items={items.rest}/>
      </Collapse.Panel>
    </Collapse>
)

export default DealsItems