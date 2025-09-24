import { vstack } from "../../styled-system/patterns";
import { useListUnits, type UseListUnitsOptions } from "../hooks/useListUnits";
import { Purchasable } from "./Purchasable";

const PurchasePane: React.FC<UseListUnitsOptions> = ({ type, sortBy }) => {
  const units = useListUnits({
    type: type,
    sortBy: sortBy,
  });

  return (
    <div
      className={vstack({
        width: "full",
        gap: "3",
        padding: "2",
      })}
    >
      {units.map((unit) => (
        <Purchasable key={unit.key.toString()} unit={unit} />
      ))}
    </div>
  );
};

export { PurchasePane };
