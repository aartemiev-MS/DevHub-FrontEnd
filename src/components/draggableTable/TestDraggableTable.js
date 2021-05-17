import React, { useState, useCallback } from "react";
import TableRow from "./TableRow";
import styled from "styled-components";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { ITEMS } from "./data";
import arrayMove from "./arrayMove";

const MyTableWrapper = styled.div`
  padding: 10px;

  .fixed_header {
    width: 800px;
    table-layout: fixed;
    border-collapse: collapse;

    & > tbody {
      display: block;
      width: 807px;
      overflow: auto;
      height: 400px;
      cursor: grabbing;
      background: grey;
    }

    & > thead {
      background: yellow;
      color: black;

      & > tr {
        display: block;
        //width: 793px;
      }
    }

    & > thead th,
    & > tbody td {
      padding: 5px;
      text-align: left;
      width: 200px;
      border: 1px solid #000;
    }
  }
`;

const SortableCont = SortableContainer(({ children }) => {
    return <tbody>{children}</tbody>;
});

const SortableItem = SortableElement(props => <TableRow {...props} />);

const MyTable = () => {
    const [items, setItems] = useState(ITEMS);

    const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
        setItems(oldItems => arrayMove(oldItems, oldIndex, newIndex));
    }, []);

    return (
        <div>
            <SortableCont
                onSortEnd={onSortEnd}
                axis="y"
                lockAxis="y"
                lockToContainerEdges={true}
                lockOffset={["30%", "50%"]}
                helperClass="helperContainerClass"
                useDragHandle={true}
            >
                {items.map((value, index) => (
                    <SortableItem
                        key={`item-${index}`}
                        index={index}
                        first={value.first}
                        second={value.second}
                        third={value.third}
                        fourth={value.fourth}
                    />
                ))}
            </SortableCont>
        </div>
    );
};

export default MyTable;
