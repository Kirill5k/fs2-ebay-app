import {ResellableItem} from "@/store/state";

interface DealsTableProps {
  items: ResellableItem[]
}

const DealsTable = ({items}: DealsTableProps) => {
  return (
    <div>
      <h1>Deals Table</h1>
      {/* Add your table implementation here */}
    </div>
  );
}

export default DealsTable;