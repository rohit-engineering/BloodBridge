import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods.js";
import { FaArrowRight } from "react-icons/fa6";

const Prospects = () => {
  const [prospects, setProspects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: "name", headerName: "Prospect name", flex: 1, minWidth: 160 },
    { field: "address", headerName: "Address", flex: 1, minWidth: 170 },
    { field: "bloodgroup", headerName: "Blood group", width: 120 },
    { field: "diseases", headerName: "Conditions", flex: 1, minWidth: 140 },

    {
      field: "review",
      headerName: "Action",
      width: 160,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/prospect/${params.row._id}`}>
              <button className="inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100">
                Review <FaArrowRight />
              </button>
            </Link>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const getProspects = async () => {
      try {
        const res = await publicRequest.get("/prospects");
        setProspects(res.data);
      } catch (error) {
        setError(error.response?.data?.message || "Could not load prospects.");
      } finally {
        setLoading(false);
      }
    };
    getProspects();
  }, []);
  return (
    <main className="p-5 sm:p-8 lg:p-10">
      <div><p className="text-sm font-bold text-rose-600">REVIEW QUEUE</p><h1 className="mt-1 text-3xl font-black">Prospective donors</h1><p className="mt-2 text-slate-500">Review submitted details before approving a donor.</p></div>
      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}
      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <DataGrid
          rows={prospects}
          getRowId={(row) => row._id}
          columns={columns}
          loading={loading}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          sx={{ border: 0, "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f8fafc" } }}
        />
      </div>
    </main>
  );
};

export default Prospects;
