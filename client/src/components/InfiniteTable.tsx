import { useMenuState } from "@szhsin/react-menu";
import { useEffect, useRef, useState } from "react";
import InView, { useInView } from "react-intersection-observer";
import { Column, Row, useGlobalFilter, useSortBy, useTable } from "react-table";
import ContextMenu from "./ContextMenu";

interface Props<T extends {}> {
  columns: Column<T>[];
  rows: T[];
  searchValue: string;
  pageSize?: number;
  autoPaginate?: boolean;
  rootMargin?: string;
  uniqueRowId?: string;
  setRowClassName?: (row: Row<T>) => string;
  onScrollHitLast: () => void;
  contextMenuAction: (id?: string | number) => void;
}

const InfiniteTable = <T,>({
  columns,
  rows: data,
  searchValue,
  pageSize = 50,
  autoPaginate = false,
  rootMargin = "400px",
  uniqueRowId = "",
  setRowClassName = () => "",
  onScrollHitLast,
  contextMenuAction,
}: Props<T>) => {
  const scrollingRef = useRef<HTMLDivElement>(null);
  const [lastVisibleIndex, setLastVisibleIndex] = useState(0);
  const [menuProps, toggleMenu] = useMenuState();
  const [anchorPts, setAnchorPts] = useState({ x: 0, y: 0 });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // @ts-ignore
    setGlobalFilter,
  } = useTable(
    {
      data: data as any,
      columns: columns as any,
    },
    useGlobalFilter,
    useSortBy
  );

  const { ref, inView } = useInView({
    threshold: 0.1,
    root: scrollingRef.current,
    rootMargin,
  });

  useEffect(() => {
    if (inView) {
      onScrollHitLast();
      if (autoPaginate) setLastVisibleIndex((prev) => prev + pageSize);
    }
  }, [autoPaginate, inView, onScrollHitLast, pageSize]);

  useEffect(() => {
    if (rows.length === pageSize) setLastVisibleIndex(5);
  }, [pageSize, rows.length]);

  useEffect(() => {
    setGlobalFilter(searchValue.trim());
  }, [searchValue, setGlobalFilter]);

  const handleContextMenu: React.MouseEventHandler<HTMLTableRowElement> = (
    e
  ) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    const { clientX, clientY } = e;
    setAnchorPts({ x: clientX, y: clientY });
    toggleMenu(true);
    contextMenuAction(id);
  };

  return (
    <>
      <div ref={scrollingRef} className="newcomers__table-container">
        <div className="newcomers__table-container__inner-container">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((group) => (
                <tr {...group.getHeaderGroupProps()}>
                  {group.headers.map((col) => (
                    // @ts-ignore
                    <th {...col.getHeaderProps(col.getSortByToggleProps())}>
                      {col.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, index) => {
                prepareRow(row);
                if (index <= lastVisibleIndex)
                  return (
                    <InView
                      key={row.id}
                      root={scrollingRef.current}
                      rootMargin={rootMargin}
                      threshold={0.1}
                    >
                      {({ inView, ref: innerRef }) => {
                        return (
                          <tr
                            {...row.getRowProps()}
                            ref={index === lastVisibleIndex ? ref : innerRef}
                            className={setRowClassName(row as any)}
                            id={row.values[uniqueRowId]}
                            onContextMenu={handleContextMenu}
                          >
                            {inView
                              ? row.cells.map((cell) => (
                                  <td {...cell.getCellProps()}>
                                    {cell.render("Cell")}
                                  </td>
                                ))
                              : null}
                          </tr>
                        );
                      }}
                    </InView>
                  );
                return null;
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ContextMenu
        menuProps={menuProps}
        toggleMenu={toggleMenu}
        anchorPoint={anchorPts}
      />
    </>
  );
};

export default InfiniteTable;
