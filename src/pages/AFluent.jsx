import React, { useCallback, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  makeStyles,
  shorthands,
  Body1,
  Button,
  Input,
  Label,
  Text,
  ButtonProps,
  Caption1,
  tokens,
  Subtitle1,
  Card,
  CardHeader,
  CardPreview,
  FieldProps, 
  Field
} from "@fluentui/react-components";
import { TabList, Tab } from "@fluentui/react-tabs";
import { useId, useBoolean } from "@fluentui/react-hooks";
import { getTheme, mergeStyleSets, FontWeights, Modal } from "@fluentui/react";
import { DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { PersonRegular, MicRegular } from "@fluentui/react-icons";
import { MoreHorizontal20Filled } from "@fluentui/react-icons";

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

const resolveAsset = (asset: string) => {
  const ASSET_URL =
    "https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-card/stories/assets/";

  return `${ASSET_URL}${asset}`;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("20px"),
    // Prevent the example from taking the full width of the page (optional)
    maxWidth: "400px",
    // Stack the label above the field (with 2px gap per the design system)
    "> div": {
      display: "flex",
      flexDirection: "column",
      ...shorthands.gap("2px"),
    },
  },
  main: {
    ...shorthands.gap("36px"),
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
  },

  card: {
    width: "360px",
    maxWidth: "100%",
    height: "fit-content",
    marginRight:"10px"
  },

  section: {
    width: "fit-content",
  },

  title: {
    ...shorthands.margin(0, 0, "12px"),
  },

  horizontalCardImage: {
    width: "64px",
    height: "64px",
  },

  headerImage: {
    ...shorthands.borderRadius("4px"),
    maxWidth: "42px",
    maxHeight: "42px",
  },

  caption: {
    color: tokens.colorNeutralForeground3,
  },

  text: {
    ...shorthands.margin(0),
  },
});
const AFluent = (props: Partial<FieldProps>) => {
  const styles = useStyles();
  const gridStyle = useMemo(() => ({ height: '80vh', width: '100%' }), []);
  const [selectedTabId, setSelectedTabId] = useState(0);
  const [rowData, setRowData] = useState();
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(
    false
  );
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

  const titleId = useId("title");

  const cancelIcon = { iconName: "Cancel" };

  const theme = getTheme();
  const contentStyles = mergeStyleSets({
    container: {
      display: "flex",
      flexFlow: "column nowrap",
      alignItems: "stretch"
    },
    header: [
      theme.fonts.xLargePlus,
      {
        flex: "1 1 auto",
        borderTop: `4px solid ${theme.palette.themePrimary}`,
        color: theme.palette.neutralPrimary,
        display: "flex",
        alignItems: "center",
        fontWeight: FontWeights.semibold,
        padding: "12px 12px 14px 24px"
      }
    ],
    body: {
      flex: "4 4 auto",
      padding: "0 24px 24px 24px",
      overflowY: "hidden",
      selectors: {
        p: { margin: "14px 0" },
        "p:first-child": { marginTop: 0 },
        "p:last-child": { marginBottom: 0 }
      }
    }
  });

  const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: "auto",
      marginTop: "4px",
      marginRight: "2px"
    },
    rootHovered: {
      color: theme.palette.neutralDark
    }
  };

  const beforeId = useId("content-before");
  const afterId = useId("content-after");
  const beforeAndAfterId = useId("content-before-and-after");
  const beforeLabelId = useId("before-label");
  const afterLabelId = useId("after-label");
  
  return (
    <div className="containerStyle">
        <h4>Fluent <DefaultButton onClick={showModal} text="Open Modal" /></h4> 
        <br />
        <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
          <Card className={styles.card} orientation="horizontal">
            <CardPreview className={styles.horizontalCardImage}>
              <img
                className={styles.horizontalCardImage}
                src={resolveAsset("app_logo.svg")}
                alt="App Name Document"
              />
            </CardPreview>

            <CardHeader
              header={<Text weight="semibold">App Name</Text>}
              description={
                <Caption1 className={styles.caption}>1830</Caption1>
              }
            />
          </Card>
          <Card className={styles.card} orientation="horizontal">
            <CardPreview className={styles.horizontalCardImage}>
              <img
                className={styles.horizontalCardImage}
                src={resolveAsset("app_logo.svg")}
                alt="App Name Document"
              />
            </CardPreview>

            <CardHeader
              header={<Text weight="semibold">App Name</Text>}
              description={
                <Caption1 className={styles.caption}>1830</Caption1>
              }
            />
          </Card>
          <Card className={styles.card} orientation="horizontal">
            <CardPreview className={styles.horizontalCardImage}>
              <img
                className={styles.horizontalCardImage}
                src={resolveAsset("app_logo.svg")}
                alt="App Name Document"
              />
            </CardPreview>

            <CardHeader
              header={<Text weight="semibold">App Name</Text>}
              description={
                <Caption1 className={styles.caption}>1830</Caption1>
              }
            />
          </Card>
          <Card className={styles.card} orientation="horizontal">
            <CardPreview className={styles.horizontalCardImage}>
              <img
                className={styles.horizontalCardImage}
                src={resolveAsset("app_logo.svg")}
                alt="App Name Document"
              />
            </CardPreview>

            <CardHeader
              header={<Text weight="semibold">App Name</Text>}
              description={
                <Caption1 className={styles.caption}>1830</Caption1>
              }
            />
          </Card>
        </div>
        <br />
        <TabList
          appearance="subtle"
          selectedValue={selectedTabId}
          onTabSelect={(_, tabId) => setSelectedTabId(tabId.value)}
        >
          <Tab value={0}>Tab ID 0</Tab>
          <Tab value={1}>Tab ID 1</Tab>
          <Tab value={2}>Tab ID 2</Tab>
          <Tab value={3}>Tab ID 3</Tab>
        </TabList>

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
        <br/>
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

      <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={false}
        forceFocusInsideTrap={false}
        containerClassName={contentStyles.container}
        className="containerStyle"
      >
        <div className={contentStyles.header}>
          <span>Modal Dialog</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={hideModal}
          />
        </div>
        <div>
          <Field
            label="Example field"
            validationState="success"
            validationMessage="This is a success message."
            {...props}
          >
            <Input />
          </Field>
        </div>
      </Modal>
    </div>
  );
};

export default AFluent;