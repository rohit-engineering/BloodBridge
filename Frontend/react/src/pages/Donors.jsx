import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FaPen, FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods.js";

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: "name", headerName: "Donor name", flex: 1, minWidth: 160 },
    { field: "address", headerName: "Address", flex: 1, minWidth: 170 },
    { field: "bloodgroup", headerName: "Blood group", width: 120 },
    { field: "diseases", headerName: "Conditions", flex: 1, minWidth: 140 },
    {
      field: "edit",
      headerName: "Actions",
      width: 190,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/donor/${params.row._id}`}>
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200">
                <FaPen /> Edit
              </button>
            </Link>
          </>
        );
      },
    },
    {
      field: "delete",
      headerName: "",
      width: 70,
      renderCell: (params) => {
        return (
          <>
            <button
              aria-label={`Delete ${params.row.name}`}
              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
              onClick={() => handleDelete(params.row._id)}
            ><FaTrash /></button>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const getDonors = async () => {
      try {
        const res = await publicRequest.get("/donors");
        setDonors(res.data);
      } catch (error) {
        setError(error.response?.data?.message || "Could not load donor records.");
      } finally {
        setLoading(false);
      }
    };
    getDonors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this donor record? This action cannot be undone.")) return;
    try {
      await publicRequest.delete(`/donors/${id}`);
      setDonors((current) => current.filter((donor) => donor._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || "Could not delete the donor.");
    }
  };

  return (
    <main className="p-5 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-sm font-bold text-rose-600">DONOR DIRECTORY</p><h1 className="mt-1 text-3xl font-black">Verified donors</h1><p className="mt-2 text-slate-500">View, edit, and maintain approved donor records.</p></div>
        <Link to="/admin/newdonor">
          <button className="primary-button"><FaPlus /> Add verified donor</button>
        </Link>
      </div>
      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}
      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <DataGrid
          rows={donors}
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

export default Donors;
