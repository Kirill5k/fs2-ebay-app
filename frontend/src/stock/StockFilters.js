import {Select, Space} from 'antd'

const StockSelectFilter = ({items, value, placeHolder, onChange}) => {
  return (
      <Select
          size="small"
          mode="multiple"
          allowClear
          style={{width: '100%'}}
          placeholder={placeHolder}
          value={value}
          onChange={onChange}
          options={items.map(r => ({label: r, value: r}))}
      />
  )
}

const StockFilters = ({options, selections, onChange}) => {
  return (
      <Space style={{width: '100%'}} direction="vertical">
        <StockSelectFilter
            items={options.retailers}
            value={selections.retailers}
            placeHolder="Select retailer"
            onChange={retailers => onChange({...selections, retailers})}
        />
      </Space>
  )
}

export default StockFilters