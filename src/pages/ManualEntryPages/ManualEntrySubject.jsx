import React, { useRef, useState, useEffect } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import nodata from "../../assets/images/nodataa.png";
import { useNavigate } from "react-router-dom";
import {
  getSubjects,
  addSubjectAPI,
  deleteSubjectAPI,
  updateSubjectAPI, bulkUploadSubjects
} from "../../services/api";
import BackButton from "../../components/common/BackButton";
import Swal from "sweetalert2";
import ManualEntryTable from "../../components/ui/manualEntryTable";
import SubjectTable from "../../components/ManualEntry/SubjectTable";
import FormInput from "../../components/ManualEntry/FormInput";
import FormSelect from "../../components/ManualEntry/FormSelect";
import { Button } from "../../components/ui/Button";



// =============================
// COMPONENT
// =============================
export default function ManualEntrySubject() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    department: "",
    section: "",
    semester: "",
    hrsWeek: "",
    type: "",
    course: "",
    isElective: false,
  });


  const triggerFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (
      !validTypes.includes(file.type) &&
      !file.name.match(/\.(csv|xlsx|xls)$/i)
    ) {
      Swal.fire({
        icon: "warning",
        text: "Please upload a valid CSV or XLSX file",
        confirmButtonColor: "#4BACCE",
      });

      e.target.value = "";
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await bulkUploadSubjects(file);

      if (response?.success || Array.isArray(response)) {
        await fetchSubjects();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Failed to upload file: " + (err.message || "Unknown error"),
        confirmButtonColor: "#4BACCE",
      });
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSubjects();

      const mapped = (response?.data || []).map((s) => ({
        _id: s._id,
        name: s.name,
        code: s.code,
        department: s.department,
        semester: s.semester || "--",
        section: s.section || "--",
        type: s.type,
        hrsWeek: s.hoursPerWeek,
        course: s.course || "",
        isElective: s.isElective || false,
      }));

      setSubjects(mapped);
    } catch (err) {
      setError(err.message || "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const saveSubject = async () => {
    if (!form.name || !form.code) {
      setError("Please enter Subject name and Subject code");
      return;
    }

    if (!form.type || !["theory", "lab"].includes(form.type)) {
      setError("Please select valid type (Theory / Practical)");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: form.name,
        code: form.code,
        department: form.department,
        course: form.course,
        section: form.section,
        semester: Number(form.semester),
        type: form.type,
        isElective: form.isElective,
        hoursPerWeek: Number(form.hrsWeek || 0),
      };

      let response;
      if (editingId) response = await updateSubjectAPI(editingId, payload);
      else response = await addSubjectAPI(payload);

      if (response?.success || response?._id) {
        await fetchSubjects();
        setForm({
          name: "",
          code: "",
          department: "",
          section: "",
          semester: "",
          hrsWeek: "",
          type: "",
          course: "",
          isElective: false,
        });
        setEditingId(null);
      } else {
        setError(response.message || "Failed to save subject");
      }
    } catch (err) {
      setError(err.message || "Failed to save subject");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubject = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      code: item.code || "",
      department: item.department || "",
      section: item.section === "--" ? "" : item.section || "",
      semester: item.semester === "--" ? "" : item.semester || "",
      hrsWeek: item.hrsWeek?.toString?.() || "",
      type: item.type || "",
      course: item.course || "",
      isElective: item.isElective || false,
    });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      code: "",
      department: "",
      section: "",
      semester: "",
      hrsWeek: "",
      type: "",
      course: "",
      isElective: false,
    });
    setError("");
  };

  const handleDeleteSubject = async (id) => {
    const result = await Swal.fire({
      text: "Are you sure you want to delete this subject?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F04438",
      cancelButtonColor: "#4BACCE",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      setError("");

      const response = await deleteSubjectAPI(id);

      if (response.success || response?.status) await fetchSubjects();
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Failed to delete subject: " + err.message,
        confirmButtonColor: "#4BACCE",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="h-screen overflow-hidden bg-[#F3F6FB]">
      <div className="w-full h-full pb-0">
        <div
          className="bg-white rounded-[10px] shadow-sm border relative w-full h-full"
          style={{
            borderColor: "#e8e8e8",
          }}
        >
          <div className="px-6 pt-4 pb-4">
            {/* HEADER (Row 1: Logo + Close) */}
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

            {/* TITLE ROW (Row 2: Title + Upload) */}
            <div className="flex justify-between items-end mb-3">
              <div className="flex items-center gap-2">
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                  <path
                    d="M16 16H6C5.46957 16 4.96086 15.7893 4.58579 15.4142C4.21071 15.0391 4 14.5304 4 14V2C4 1.46957 4.21071 0.960859 4.58579 0.585786C4.96086 0.210714 5.46957 0 6 0H7V5L9 3.5L11 5V0H16C16.5304 0 17.0391 0.210714 17.4142 0.585786C17.7893 0.960859 18 1.46957 18 2V14C18 14.5304 17.7893 15.0391 17.4142 15.4142C17.0391 15.7893 16.5304 16 16 16ZM14 18V20H2C1.46957 20 0.960859 19.7893 0.585786 19.4142C0.210714 19.0391 0 18.5304 0 18V4H2V18H14Z"
                    fill="#265768"
                  />
                </svg>
                <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#265768]">
                  Quick add subject
                </h2>
              </div>
            </div>

            <div
              className="h-[3px] bg-[#0b84d6] rounded w-[calc(100%+48px)] -mx-6"
              style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
            />

            <div className="mt-6">
              <div className="grid grid-cols-12 gap-x-2 gap-y-6 mr-8">
                <div className="col-span-3">
                  <FormInput label="Subject name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. DAA" />
                </div>

                <div className="col-span-3">
                  <FormInput label="Subject code" name="code" value={form.code} onChange={handleChange} placeholder="e.g. CS201" />
                </div>

                <div className="col-span-3">
                  <FormInput label="Department" name="department" value={form.department} onChange={handleChange} placeholder="e.g. CSE" />
                </div>

                <div className="col-span-3">
                  <FormInput label="Course" name="course" value={form.course} onChange={handleChange} placeholder="e.g. BTECH" />
                </div>

                <div className="col-span-3">
                  <FormInput label="Section" name="section" value={form.section} onChange={handleChange} placeholder="e.g. A" />
                </div>

                <div className="col-span-3">
                  <FormInput label="Semester" name="semester" value={form.semester} onChange={handleChange} placeholder="e.g. 4" />
                </div>

                <div className="col-span-3">
                  <FormInput label="Hrs/Week" name="hrsWeek" value={form.hrsWeek} onChange={handleChange} placeholder="e.g. 4" />
                </div>

                <div className="col-span-3">
                  <FormSelect label="Type" name="type" value={form.type} onChange={handleChange}>
                    <option value="">Select Type</option>
                    <option value="theory">Theory</option>
                    <option value="lab">Practical / Lab</option>
                  </FormSelect>
                </div>

                <div className="col-span-3">
                  <FormSelect
                    label="Is Elective?"
                    name="isElective"
                    value={form.isElective ? "true" : "false"}
                    onChange={(e) => handleChange({ target: { name: "isElective", value: e.target.value === "true", type: "select" } })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </FormSelect>
                </div>

                <div className="col-span-3 flex items-end">
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                    <Button variant="addItem" onClick={saveSubject} disabled={loading}>
                      {editingId ? (loading ? "Updating..." : "+ Update subject") : loading ? "Adding..." : "+ Add subject"}
                    </Button>
                    {editingId && (
                      <button
                        onClick={cancelEdit}
                        style={{
                          fontSize: "12px",
                          color: "#F04438",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "'Mulish', sans-serif",
                          textAlign: "left",
                        }}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-[2px] bg-[#D9D9D9] mt-7" />

            {error && (
              <div className="mt-3 text-center text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            {/* TABLE */}
            {subjects.length === 0 ? (
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
                <SubjectTable
                  subjects={subjects}
                  onEdit={handleEditSubject}
                  onDelete={handleDeleteSubject}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
