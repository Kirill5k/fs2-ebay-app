import {useState} from 'react'
import {Select, Space} from 'antd'

const StockSelectFilter = ({items, placeHolder}) => {
  const [currentItems, setCurrentItems] = useState(items)
  const handleChange = (value) => {
    console.log(`selected ${value} ${typeof value}`)
    setCurrentItems(value)
  };

  return (
      <Select
          mode="multiple"
          allowClear
          style={{width: '100%'}}
          placeholder={placeHolder}
          value={currentItems}
          onChange={handleChange}
          options={items.map(r => ({label: r, value: r}))}
      />
  )
}

const StockFilters = ({filters}) => {
  return (
      <Space style={{width: '100%'}} direction="vertical">
        <StockSelectFilter
            items={filters.retailers}
            placeHolder="Select retailer"
        />
      </Space>
  )
}

export default StockFilters