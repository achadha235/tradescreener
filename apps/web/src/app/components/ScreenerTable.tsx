import useStaticJSON from "@/client/getStaticJSON";
import { Download } from "@mui/icons-material";
import { Button, Fade, Skeleton, ThemeProvider } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import clsx from "clsx";
import { kebabCase } from "lodash";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { usePapaParse } from "react-papaparse";
import { getNumberFormat } from "./ScreenerFilter/ScreenerFilter";

const CSVDownloader = ({
  disabled,
  csvData,
  className,
  filename,
}: {
  disabled;
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
      disabled={disabled}
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

export default function ScreenerTable({ loading, csv, screenerName }) {
  const [rows, setRows] = useState<any>({ headers: [], rows: [] });
  const { readString } = usePapaParse();
  const [csvData, setCSVData] = useState<any>([]);
  const { data: allDatatags, isLoading } = useStaticJSON("/datatags.json");

  function produceData(csv: string) {
    const result = readString(csv, {
      worker: true,
      complete(results) {
        let csvRows: any[] = results["data"];
        let headers = csvRows[0];
        let newRows: any[] = [];
        for (let i = 1; i < csvRows.length; i++) {
          let row = csvRows[i];
          let rowData = { id: i };
          if (row.length !== headers.length) {
            continue;
          }
          for (let j = 0; j < headers.length; j++) {
            rowData[headers[j]] = row[j];
          }
          newRows.push(rowData);
        }
        setRows({
          headers: headers.filter((h) => h !== "figi" && h.length > 0),
          rows: newRows,
        });
        setCSVData(results);
      },
    });
  }

  useEffect(() => {
    if (!isLoading) {
      produceData(csv);
    }
  }, [csv, isLoading]);

  const visibleHeader = rows?.headers;
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
        width: 100,
      };
    } else if (header === "name") {
      return {
        field: header,
        headerName: "Name",
        minWidth: 180,
        flex: 1.5,
      };
    }

    const params: GridColDef = {
      field: header,
      headerName: headerName,
      flex: 1,
      editable: false,
      resizable: false,
      minWidth: 140,
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

  const somerows = rows?.rows;

  return (
    <Fade in={!isLoading} timeout={300} className="min-h-500px pb-10">
      <div className="h-full w-full">
        <div className="flex w-full justify-between px-4 mt-4">
          <div>
            {rows?.rows?.length ? (
              <>Found {rows?.rows?.length} results</>
            ) : (
              <>Found 0 results.</>
            )}
          </div>

          <CSVDownloader
            disabled={rows?.rows?.length === 0}
            csvData={csv}
            filename={`${kebabCase(screenerName)}.csv`}
          />
        </div>

        {allDatatags && somerows && somerows?.length > 0 && (
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
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            disableRowSelectionOnClick={true}
            disableColumnSelector={true}
            disableColumnFilter={true}
            disableColumnMenu={true}
            pageSizeOptions={[5, 10, 25, 50, 100]}
          />
        )}
      </div>
    </Fade>
  );
}
