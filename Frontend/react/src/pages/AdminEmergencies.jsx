import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa6";
import { publicRequest } from "../requestMethods";

const AdminEmergencies = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user.currentUser);
  const headers = { Authorization: `Bearer ${user.accessToken}` };

  useEffect(() => {
    publicRequest.get("/emergencies?all=true").then(({ data }) => setRequests(data)).catch(() => setError("Could not load emergency requests."));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await publicRequest.patch(`/emergencies/${id}/status`, { status }, { headers });
      setRequests((current) => current.map((request) => request._id === id ? data : request));
    } catch (requestError) { setError(requestError.response?.data?.message || "Could not update request."); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this emergency request permanently?")) return;
    try {
      await publicRequest.delete(`/emergencies/${id}`, { headers });
      setRequests((current) => current.filter((request) => request._id !== id));
    } catch (requestError) { setError(requestError.response?.data?.message || "Could not delete request."); }
  };

  return (
    <main className="p-5 sm:p-8 lg:p-10">
      <div><p className="text-sm font-bold text-rose-600">EMERGENCY BOARD</p><h1 className="mt-1 text-3xl font-black">Manage blood requests</h1><p className="mt-2 text-slate-500">Track active requests and close them once fulfilled.</p></div>
      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}
      <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr>{["Patient / Hospital", "Blood", "Units", "Date", "Urgency", "Contact", "Status", ""].map((item) => <th key={item} className="px-5 py-4">{item}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{requests.map((request) => <tr key={request._id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-bold">{request.patientName}</p><p className="mt-1 text-slate-500">{request.hospital}</p></td><td className="px-5 py-4"><span className="rounded-lg bg-rose-100 px-3 py-2 font-black text-rose-700">{request.bloodgroup}</span></td><td className="px-5 py-4 font-bold">{request.unitsRequired}</td><td className="px-5 py-4">{new Date(request.date).toLocaleDateString()}</td><td className="px-5 py-4 font-bold">{request.urgency}</td><td className="px-5 py-4">{request.contactNumber}</td><td className="px-5 py-4"><select className="rounded-lg border border-slate-200 px-3 py-2 font-semibold" value={request.status} onChange={(event) => updateStatus(request._id, event.target.value)}>{["Active", "Fulfilled", "Closed"].map((item) => <option key={item}>{item}</option>)}</select></td><td className="px-5 py-4"><button onClick={() => remove(request._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Delete request"><FaTrash /></button></td></tr>)}</tbody>
        </table>
        {!requests.length && <div className="p-10 text-center text-slate-500">No emergency requests have been published.</div>}
      </div>
    </main>
  );
};

export default AdminEmergencies;
