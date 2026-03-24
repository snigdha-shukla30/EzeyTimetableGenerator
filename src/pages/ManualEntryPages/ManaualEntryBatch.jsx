import React, { useRef, useState, useEffect } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import nodata from "../../assets/images/nodataa.png";
import {
  getBatches,
  addBatch as addBatchAPI,
  updateBatch,
  deleteBatch,
  getSubjects,
  getFaculties,
} from "../../services/api";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import Swal from "sweetalert2";
import ManualEntryTable from "../../components/ui/manualEntryTable";
import MultiSelect from "../../components/ManualEntry/MultiSelect";
import BatchTable from "../../components/ManualEntry/BatchTable";
import FormInput from "../../components/ManualEntry/FormInput";
import { Button } from "../../components/ui/Button";


export default function ManualEntryBatch() {
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const [batches, setBatches] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [facultiesList, setFacultiesList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupItems, setPopupItems] = useState([]);

  const [form, setForm] = useState({
    course: "",
    department: "",
    name: "",
    strength: "",
    semester: "",
    subjects: [],
    faculties: [],
  });

  const navigate = useNavigate();

  const normalizeArrayResponse = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res?.success && Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.subjects)) return res.subjects;
    if (Array.isArray(res?.faculties)) return res.faculties;
    if (Array.isArray(res?.batches)) return res.batches;
    return [];
  };

  const openListPopup = (title, items) => {
    setPopupTitle(title);
    setPopupItems(Array.isArray(items) ? items : []);
    setShowPopup(true);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    await Promise.all([loadSubjects(), loadFaculties(), loadBatches()]);
  };

  const loadSubjects = async () => {
    try {
      const res = await getSubjects();
      setSubjectsList(normalizeArrayResponse(res));
    } catch (err) {
      setSubjectsList([]);
    }
  };

  const loadFaculties = async () => {
    try {
      const res = await getFaculties();
      setFacultiesList(normalizeArrayResponse(res));
    } catch (err) {
      setFacultiesList([]);
    }
  };

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getBatches();
      setBatches(normalizeArrayResponse(res));
    } catch (err) {
      setError(err.message || "Failed to load batches");
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  const triggerFile = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSubject = (subject) => {
    setForm((prev) => {
      const exists = prev.subjects.find((s) => s._id === subject._id);
      if (exists) {
        return { ...prev, subjects: prev.subjects.filter((s) => s._id !== subject._id) };
      } else {
        return { ...prev, subjects: [...prev.subjects, subject] };
      }
    });
  };

  const toggleFaculty = (faculty) => {
    setForm((prev) => {
      const exists = prev.faculties.find((f) => f._id === faculty._id);
      if (exists) {
        return { ...prev, faculties: prev.faculties.filter((f) => f._id !== faculty._id) };
      } else {
        return { ...prev, faculties: [...prev.faculties, faculty] };
      }
    });
  };

  const removeSubject = (subjectId) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s._id !== subjectId),
    }));
  };

  const removeFaculty = (facultyId) => {
    setForm((prev) => ({
      ...prev,
      faculties: prev.faculties.filter((f) => f._id !== facultyId),
    }));
  };

  const handleAddBatch = async () => {
    if (!form.course || !form.department || !form.name || !form.strength || !form.semester) {
      setError("Please fill all required fields");
      return;
    }
    if (form.subjects.length === 0) {
      setError("Please select at least one subject");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const code = `${form.department}_${Number(form.semester)}_${form.name}_2025`;
      const payload = {
        name: form.name,
        course: form.course,
        code,
        semester: Number(form.semester),
        department: form.department,
        strength: Number(form.strength),
        subjects: form.subjects.map((subject) => subject._id),
      };

      let res;
      if (editingId) res = await updateBatch(editingId, payload);
      else res = await addBatchAPI(payload);

      if (res?.success || res?._id) {
        await loadBatches();
        resetForm();
      } else {
        throw new Error(res?.message || "Failed to save batch");
      }
    } catch (err) {
      setError(err.message || "Failed to save batch");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (batch) => {
    const subjects = batch.raw?.subjects || batch.subjects || [];
    const subjectsFromBatch = Array.isArray(subjects)
      ? subjects.map((s) => (typeof s.subject === "object" ? s.subject : s)).filter(Boolean)
      : [];
    const facultiesFromBatch = Array.isArray(subjects)
      ? subjects.map((s) => (typeof s.faculty === "object" ? s.faculty : s)).filter(Boolean)
      : [];

    setForm({
      course: batch.course || batch.degree || "",
      department: batch.department || "",
      name: batch.section || batch.name || batch.raw?.name || "",
      strength: (batch.capacity || batch.strength || batch.raw?.strength)?.toString?.() || "",
      semester: batch.semester?.toString?.() || "",
      subjects: subjectsFromBatch,
      faculties: facultiesFromBatch,
    });
    setEditingId(batch._id);
    setError("");
  };

  const handleDeleteBatch = async (id) => {
    const result = await Swal.fire({
      text: "Are you sure you want to delete this batch?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC3545",
      cancelButtonColor: "#4BACCE",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      setError("");
      const res = await deleteBatch(id);
      if (res?.success) await loadBatches();
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err.message || "Failed to delete batch",
        confirmButtonColor: "#4BACCE",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      course: "",
      department: "",
      name: "",
      strength: "",
      semester: "",
      subjects: [],
      faculties: [],
    });
    setEditingId(null);
    setError("");
  };


  return (
    <div className="h-screen overflow-hidden bg-[#F3F6FB]">
      <div className="w-full h-full pb-0">
        <div
          className="bg-white rounded-[10px] shadow-sm border relative w-full h-full"
          style={{ borderColor: "#e8e8e8" }}
        >
          <div className="px-6 pt-4 pb-4">
            {/* HEADER */}
            <div className="flex justify-between items-start mb-6">
              <div
                className="text-3xl font-['Playfair_Display'] font-bold text-[#6b6b6b]"
                style={{ textShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)" }}
              >
                Ezey
              </div>
              <button
                type="button"
                onClick={() => navigate("/form")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <BackButton />
              </button>
            </div>

            {/* TITLE ROW */}
            <div className="flex justify-between items-end mb-3">
              <div className="flex items-center gap-2">
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                  <path
                    d="M16 16H6C5.46957 16 4.96086 15.7893 4.58579 15.4142C4.21071 15.0391 4 14.5304 4 14V2C4 1.46957 4.21071 0.960859 4.58579 0.585786C4.96086 0.210714 5.46957 0 6 0H7V5L9 3.5L11 5V0H16C16.5304 0 17.0391 0.210714 17.4142 0.585786C17.7893 0.960859 18 1.46957 18 2V14C18 14.5304 17.7893 15.0391 17.4142 15.4142C17.0391 15.7893 16.5304 16 16 16ZM14 18V20H2C1.46957 20 0.960859 19.7893 0.585786 19.4142C0.210714 19.0391 0 18.5304 0 18V4H2V18H14Z"
                    fill="#265768"
                  />
                </svg>
                <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
                  Quick add batch
                </h2>
              </div>
            </div>

            <div
              className="h-[3px] bg-[#0b84d6] rounded w-[calc(100%+48px)] -mx-6 mb-4"
              style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
            />

            {error && (
              <div className="mb-4 text-center text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-4 gap-y-4 mr-0 lg:mr-8 mb-4">
              <div className="lg:col-span-3">
                <FormInput
                  label="Degree"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="e.g. BCA"
                  disabled={loading}
                />
              </div>

              <div className="lg:col-span-3">
                <FormInput
                  label="Department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  disabled={loading}
                />
              </div>

              <div className="lg:col-span-3">
                <FormInput
                  label="Section"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. A"
                  disabled={loading}
                />
              </div>

              <div className="lg:col-span-3">
                <FormInput
                  label="Strength"
                  name="strength"
                  value={form.strength}
                  onChange={handleChange}
                  placeholder="e.g. 60"
                  type="number"
                  disabled={loading}
                />
              </div>

              <div className="lg:col-span-3">
                <FormInput
                  label="Semester"
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  disabled={loading}
                />
              </div>

              <div className="lg:col-span-3">
                <MultiSelect
                  label="Assigned subjects"
                  placeholder="Select subjects"
                  options={subjectsList}
                  selectedItems={form.subjects}
                  onToggle={toggleSubject}
                  onRemove={removeSubject}
                  displayKey="name"
                  secondaryKey="code"
                  additionalKeys={["department", "semester", "section", "type", "course"]}
                />
              </div>

              <div className="lg:col-span-3 flex items-end justify-start lg:justify-end">
                <Button
                  variant="addItem"
                  onClick={handleAddBatch}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "+ Add batch"}
                </Button>
              </div>
            </div>

            <div className="w-full h-[2px] bg-[#D9D9D9] mb-6" />

            {loading && batches.length === 0 ? (
              <div
                className="mt-6 border rounded-lg flex flex-col justify-center items-center gap-1 px-4"
                style={{ height: "380px", borderColor: "#DFDFDF" }}
              >
                <div className="text-gray-500">Loading batches...</div>
              </div>
            ) : batches.length === 0 ? (
              <div
                className="mt-4 border rounded-lg flex flex-col justify-center items-center gap-1 px-4"
                style={{ height: "380px", borderColor: "#DFDFDF" }}
              >
                <img
                  src={nodata}
                  alt="No Data"
                  className="w-full max-w-[380px] h-auto object-contain mt-2 mb-[-10px]"
                />
                <div
                  className="text-[24px] font-['Playfair_Display'] font-bold text-[#aeadad]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  No Data !
                </div>
              </div>
            ) : (
              <div className="mt-6 pb-6">
                <BatchTable
                  batches={batches}
                  loading={loading}
                  onEdit={handleEdit}
                  onDelete={handleDeleteBatch}
                  onOpenPopup={openListPopup}
                />
              </div>
            )}
          </div>

          {showPopup && (
            <div
              className="fixed inset-0 z-[999] flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.35)" }}
              onClick={() => setShowPopup(false)}
            >
              <div
                className="bg-white rounded-[10px] shadow-lg border"
                style={{
                  width: "420px",
                  maxHeight: "420px",
                  overflow: "hidden",
                  borderColor: "#e8e8e8",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-3 border-b">
                  <div className="text-[16px] font-semibold text-[#265768]">
                    {popupTitle}
                  </div>
                  <button onClick={() => setShowPopup(false)}>
                    <X size={18} color="#265768" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto" style={{ maxHeight: "340px" }}>
                  {popupItems.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">No data</div>
                  ) : (
                    <ul className="space-y-2">
                      {popupItems.map((x, i) => (
                        <li
                          key={`${x?._id || "item"}-${i}`}
                          className="text-[13px] text-[#265768] border rounded px-3 py-2"
                          style={{ borderColor: "#DFDFDF" }}
                        >
                          {popupTitle === "Assigned Subjects"
                            ? `${x?.name || "-"}${x?.code ? ` (${x.code})` : ""}`
                            : `${x?.name || "-"}${x?.email ? ` (${x.email})` : ""}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
