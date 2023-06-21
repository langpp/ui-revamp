import React, { useCallback, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs, Button, Modal, Input, Card, Col, Row } from "antd";

// AG GRID
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import PersonFilter from '../filter/personFilter.jsx';
import YearFilter from '../filter/yearFilter.jsx';

// HANDSONTABLE
import { HotTable, HotColumn } from "@handsontable/react";
import { data } from "../component/constants";
import { ProgressBarRenderer } from "../component/ProgressBar";
import { StarsRenderer } from "../component/Stars";
import "pikaday/css/pikaday.css";
import "handsontable/dist/handsontable.min.css";
import {
    drawCheckboxInRowHeaders,
    addClassesToRows,
    changeCheckboxCell,
    alignHeaders
  } from "../component/hooksCallbacks";

import '../styles.css';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const AAntDesign = () => {
  const gridStyle = useMemo(() => ({ height: '80vh', width: '100%' }), []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [value, setValue] = useState('');
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: 'athlete', minWidth: 150, filter: PersonFilter, filter: 'agNumberColumnFilter' },
    { field: 'age', filter: 'agNumberColumnFilter' },
    { field: 'country', minWidth: 150 },
    { field: 'year', filter: YearFilter, filter: 'agNumberColumnFilter' },
    {
      field: 'date',
      minWidth: 130,
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {
          const dateAsString = cellValue;
          const dateParts = dateAsString.split('/');
          const cellDate = new Date(
            Number(dateParts[2]),
            Number(dateParts[1]) - 1,
            Number(dateParts[0])
          );
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        },
      },
    },
    { field: 'sport' },
    { field: 'gold', filter: 'agNumberColumnFilter' },
    { field: 'silver', filter: 'agNumberColumnFilter' },
    { field: 'bronze', filter: 'agNumberColumnFilter' },
    { field: 'total', filter: 'agNumberColumnFilter' },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      sortable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      resizable: true,
      floatingFilter: true,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => {
        setRowData(data);
      });
  }, []);
  
  return (
    <div className="containerStyle">
        <h4>ANT DESIGN
            &nbsp;<Button type="primary" onClick={showModal}>
                Modal Dialog
            </Button>
        </h4>
        <br />
        <Row gutter={24}>
            <Col className="gutter-row" span={6}>
                <Card
                    hoverable
                >
                    <Meta title="Developer" description="1980" />
                </Card>
            </Col>
            <Col className="gutter-row" span={6}>
                <Card
                    hoverable
                >
                    <Meta title="Developer" description="1980" />
                </Card>
            </Col>
            <Col className="gutter-row" span={6}>
                <Card
                    hoverable
                >
                    <Meta title="Developer" description="1980" />
                </Card>
            </Col>
            <Col className="gutter-row" span={6}>
                <Card
                    hoverable
                >
                    <Meta title="Developer" description="1980" />
                </Card>
            </Col>
        </Row>
        <br />
        <Tabs
            defaultActiveKey="1"
        >
            <TabPane
            tab="AG Grid"
            key="1"
            >
                <div style={gridStyle} className="ag-theme-alpine">
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        editable= {true}
                        enableRowGroup= {true}
                        enablePivot= {true}
                        enableValue= {true}
                        sortable= {true}
                        resizable= {true}
                        filter= {true}
                        flex= {1}
                        minWidth= {100}
                        pagination={true}
                        paginationPageSize={50}
                        defaultColDef={defaultColDef}
                        onGridReady={onGridReady}
                    ></AgGridReact>
                </div>
            </TabPane>

            <TabPane tab="HandsonTable" key="2">
                <HotTable
                    data={data}
                    height={450}
                    width="100%"
                    colWidths={[177, 126, 292, 100, 100, 90, 90, 110, 97]}
                    colHeaders={[
                        "Company name",
                        "Country",
                        "Name",
                        "Sell date",
                        "Order ID",
                        "In stock",
                        "Qty",
                        "Progress",
                        "Rating"
                    ]}
                    dropdownMenu={true}
                    hiddenColumns={{
                        indicators: true
                    }}
                    contextMenu={true}
                    multiColumnSorting={true}
                    filters={true}
                    rowHeaders={true}
                    afterGetColHeader={alignHeaders}
                    beforeRenderer={addClassesToRows}
                    afterGetRowHeader={drawCheckboxInRowHeaders}
                    afterOnCellMouseDown={changeCheckboxCell}
                    manualRowMove={true}
                    pagination={true}
                    columnSorting={true}
                    sortIndicator={true}
                    licenseKey="non-commercial-and-evaluation"
                    >
                    <HotColumn data={1} />
                    <HotColumn data={2} />
                    <HotColumn data={3} />
                    <HotColumn data={4} type="date" allowInvalid={false} />
                    <HotColumn data={5} />
                    <HotColumn data={6} type="checkbox" className="htCenter" />
                    <HotColumn data={7} type="numeric" />
                    <HotColumn data={8} readOnly={true} className="htMiddle">
                        {/* @ts-ignore Element inherits some props. It's hard to type it. */}
                        <ProgressBarRenderer hot-renderer />
                    </HotColumn>
                    <HotColumn data={9} readOnly={true} className="htCenter">
                        {/* @ts-ignore Element inherits some props. It's hard to type it. */}
                        <StarsRenderer hot-renderer />
                    </HotColumn>
                </HotTable>
            </TabPane>
        </Tabs>
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <>
                <TextArea placeholder="Autosize height based on content lines" autoSize />
                <div style={{ margin: '24px 0' }} />
                <TextArea
                    placeholder="Autosize height with minimum and maximum number of lines"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                />
                <div style={{ margin: '24px 0' }} />
                <TextArea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Controlled autosize"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                />
            </>
        </Modal>
    </div>
  );
};

export default AAntDesign;