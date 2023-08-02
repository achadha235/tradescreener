import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { usePapaParse } from "react-papaparse";
import useStaticJSON from "@/client/getStaticJSON";
import { Button, CircularProgress, ThemeProvider } from "@mui/material";
import { getNumberFormat } from "./ScreenerFilter/ScreenerFilter";
import numeral from "numeral";
import clsx from "clsx";
import { Download } from "@mui/icons-material";
import { kebabCase } from "lodash";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridValueGetterParams,
} from "@mui/x-data-grid";

/// TODO: Make this table sticky
// https://codesandbox.io/s/mui-table-sticky-column-demo-7h7eq?file=/demo.tsx:1419-1445

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const CSVDownloader = ({
  csvData,
  className,
  filename,
}: {
  className?;
  csvData;
  filename;
}) => {
  const handleDownload = () => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      size="small"
      className={className}
      startIcon={<Download />}
      variant="contained"
      color="secondary"
      onClick={handleDownload}
    >
      Download CSV
    </Button>
  );
};

export default function ScreenerTable({ csv, screenerName }) {
  const [rows, setRows] = useState<any>({ headers: [], rows: [] });
  const { readString } = usePapaParse();
  const [csvData, setCSVData] = useState<any>([]);
  const { data: allDatatags, isLoading } = useStaticJSON("/datatags.json");

  function produceData(csv: string) {
    const result = readString(csv, {
      worker: true,
      complete(results) {
        setCSVData(results);
        let csvRows: any[] = results["data"];
        let headers = csvRows[0];
        let newRows: any[] = [];
        for (let i = 1; i < csvRows.length; i++) {
          let row = csvRows[i];
          let rowData = { id: i };
          for (let j = 0; j < headers.length; j++) {
            rowData[headers[j]] = row[j];
          }
          newRows.push(rowData);
        }
        setRows({
          headers: headers.filter((h) => h !== "figi"),
          rows: newRows,
        });
      },
    });
  }

  useEffect(() => {
    setRows(produceData(csv));
  }, [csv]);

  const visibleHeader = rows?.headers.slice(1);
  const columns: GridColDef[] = visibleHeader?.map((header, i) => {
    let headerName = header;
    let numberFormat = "0,0.00a";
    const tag = allDatatags?.find((tag) => tag.tag === header);

    if (tag) {
      headerName = tag.name;
      numberFormat = getNumberFormat(tag);
    }

    if (header === "ticker") {
      return {
        field: "ticker",
        headerName: "Ticker",
        width: 120,
      };
    } else if (header === "name") {
      return {
        field: header,
        headerName: "Name",
        flex: 1.5,
      };
    }

    const params: GridColDef = {
      field: header,
      headerName: headerName,
      flex: 1,
      editable: false,
      resizable: false,
      valueGetter: (params) => {
        const txt = numeral(parseFloat(params.value).toPrecision(5)).format(
          numberFormat
        );

        return txt;
      },
    };
    if (i < visibleHeader.length) {
      params["width"] = headerName.length * 10;
    }
    return params;
  });

  const somerows = rows?.rows?.slice(0, -1);

  return (
    <div>
      <div className="flex w-full justify-between px-4 mt-4">
        <div>Found {rows?.rows?.length} results</div>
        <CSVDownloader
          csvData={csv}
          filename={`${kebabCase(screenerName)}.csv`}
        />
      </div>
      {!isLoading && allDatatags && somerows && somerows.length > 0 && (
        <ThemeProvider theme={{}}>
          <DataGrid
            className="m-4"
            rows={somerows}
            columns={columns}
            getCellClassName={(params: GridCellParams) => {
              return clsx("text-right");
            }}
            rowSelection={false}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 25 },
              },
            }}
            disableRowSelectionOnClick={true}
            disableColumnSelector={true}
            disableColumnFilter={true}
            disableColumnMenu={true}
            pageSizeOptions={[5, 10, 25, 50, 100]}
          />
        </ThemeProvider>
      )}
    </div>
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div className="flex w-full justify-between px-4 mt-4">
        <div>Found {rows?.rows?.length} results</div>
        <CSVDownloader
          csvData={csv}
          filename={`${kebabCase(screenerName)}.csv`}
        />
      </div>
      <TableContainer
        className="p-4 max-w-full"
        component={({ children }) => (
          <Paper className="p-4 m-4 overflow-x-scroll">{children}</Paper>
        )}
      >
        <Table
          aria-label="simple table"
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        >
          <TableHead>
            <TableRow>
              {rows?.headers?.slice(1).map((header) => {
                let headerName = "Unknown";
                if (header === "ticker") {
                  headerName = "Ticker";
                } else if (header === "name") {
                  headerName = "Name";
                }
                const tag = allDatatags.find((tag) => tag.tag === header);
                if (tag) {
                  headerName = tag.name;
                }
                return <TableCell key={header}>{headerName}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.rows?.slice(0, -1).map((row, i) => (
              <TableRow key={row.name}>
                {rows.headers.slice(1)?.map((header) => {
                  let txt;
                  if (header === "ticker" || header === "name") {
                    txt = row[header];
                  } else {
                    const tag = allDatatags.find((tag) => tag.tag === header);
                    let numberFormat: string;
                    if (!tag) {
                      numberFormat = "0,0.00a";
                    } else {
                      numberFormat = getNumberFormat(tag);
                    }
                    txt = numeral(
                      parseFloat(row[header]).toPrecision(5)
                    ).format(numberFormat);
                  }

                  return (
                    <TableCell
                      className={clsx("font-mono", {
                        "bg-neutral-800": i % 2 === 0,
                      })}
                      key={header}
                      component="th"
                      scope="row"
                    >
                      {txt}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
