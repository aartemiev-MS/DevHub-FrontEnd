import React from "react";
import { SortableHandle } from "react-sortable-hoc";
import styled from "styled-components";

const TrWrapper = styled.tr`
  background: lightblue;
  cursor: default;

  .firstElement {
    display: flex;
    flex-direction: row;
  }

  &.helperContainerClass {
    width: auto;
    border: 1px solid #efefef;
    box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 3px;

    &:active {
      cursor: grabbing;
    }

    & > td {
      padding: 5px;
      text-align: left;
      width: 200px;
    }
  }
`;

const Handle = styled.div`
  margin-right: 10px;
  padding: 0 5px;
  cursor: grab;
`;

const RowHandler = SortableHandle(() => <Handle className="handle">|</Handle>);

const TableRow = ({ first, second, third, fourth, className }) => {
  return (
    <tr>
      <td>
        <div className="firstElement">
          <RowHandler />
          {first}
        </div>
      </td>
      <td>{second}</td>
      <td>{third}</td>
      <td>{fourth}</td>
    </tr>
  );
};

export default TableRow;
