import React, { useState, useEffect, useRef } from "react";
import { Table } from "@mantine/core";
import { Edit2, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";

import DataEntryTable from "../ui/manualEntryTable";
import { Button } from "../ui/Button";
import { InputField } from "../ui/InputField";

import {
  getBatches,
  getSubjects,
  addBatch,
  deleteBatch,
} from "../../api/api";

/* ================= MULTI SELECT (LOCAL) ================= */

function MultiSelect({
  label,
  options,
  selectedItems,
  onToggle,
  displayKey = "name",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref}>
      <div className="block text-[#265768] font-medium mb-2 text-sm">
        {label}
      </div>

      <div
        onClick={() => setOpen(!open)}
        className="h-[40px] border-2 border-gray-300 rounded-md px-3 flex items-center cursor-pointer"
      >
        {selectedItems.length
          ? `${selectedItems.length} selected`
          : "Select"}
      </div>

      {open && (
        <div className="border rounded mt-1 bg-white max-h-48 overflow-auto shadow">
          {options.map((o) => (
            <div
              key={o._id}
              onClick={() => onToggle(o)}
              className="p-2 hover:bg-blue-50 cursor-pointer text-sm"
            >
              {o[displayKey]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function BatchManager() {
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [popup, setPopup] = useState(false);
  const [popupItems, setPopupItems] = useState([]);

  const [form, setForm] = useState({
    course: "",
    department: "",
    name: "",
    strength: "",
    semester: "",
    subjects: [],
  });

  const columns = [
    { key: "course", label: "Degree" },
    { key: "department", label: "Department" },
    { key: "semester", label: "Semester" },
    { key: "section", label: "Section" },
    { key: "subjects", label: "Subjects" },
  ];

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const b = await getBatches();
    const s = await getSubjects();
    setBatches(b?.data || []);
    setSubjects(s?.data || []);
  };

  const toggleSubject = (sub) => {
    setForm((p) => ({
      ...p,
      subjects: p.subjects.some((x) => x._id === sub._id)
        ? p.subjects.filter((x) => x._id !== sub._id)
        : [...p.subjects, sub],
    }));
  };

  const handleAdd = async () => {
    await addBatch({
      ...form,
      subjects: form.subjects.map((s) => s._id),
    });

    setForm({
      course: "",
      department: "",
      name: "",
      strength: "",
      semester: "",
      subjects: [],
    });

    loadAll();
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      text: "Delete this batch?",
      showCancelButton: true,
      confirmButtonColor: "#DC3545",
    });

    if (res.isConfirmed) {
      await deleteBatch(id);
      loadAll();
    }
  };

  return (
    <>
      {/* ================= FORM ================= */}

      <div className="grid grid-cols-6 gap-4 mb-8">

        <InputField
          label="Degree"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        />

        <InputField
          label="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        />

        <InputField
          label="Section"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <InputField
          label="Strength"
          value={form.strength}
          onChange={(e) => setForm({ ...form, strength: e.target.value })}
        />

        <InputField
          label="Semester"
          value={form.semester}
          onChange={(e) => setForm({ ...form, semester: e.target.value })}
        />

        <MultiSelect
          label="Subjects"
          options={subjects}
          selectedItems={form.subjects}
          onToggle={toggleSubject}
        />

        <div className="col-span-6 flex justify-end mt-4">
          <Button variant="primary" onClick={handleAdd}>
            Add Batch
          </Button>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <DataEntryTable columns={columns}>

        {batches.map((batch) => {
          const subs = batch.subjects || [];

          return (
            <Table.Tr key={batch._id}>

              <Table.Td ta="center">{batch.course}</Table.Td>
              <Table.Td ta="center">{batch.department}</Table.Td>
              <Table.Td ta="center">{batch.semester}</Table.Td>
              <Table.Td ta="center">{batch.name}</Table.Td>

              <Table.Td ta="center">
                <button
                  className="text-blue-500 underline"
                  onClick={() => {
                    setPopupItems(subs);
                    setPopup(true);
                  }}
                >
                  See ({subs.length})
                </button>
              </Table.Td>

              <Table.Td ta="center">
                <Edit2 size={16} className="inline mr-3" />

                <Trash2
                  size={16}
                  className="inline cursor-pointer text-red-500"
                  onClick={() => handleDelete(batch._id)}
                />
              </Table.Td>

            </Table.Tr>
          );
        })}

      </DataEntryTable>

      {/* ================= POPUP ================= */}

      {popup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-4 rounded w-[350px]">

            <div className="flex justify-between mb-3">
              <div className="font-semibold text-[#265768]">
                Assigned Subjects
              </div>

              <X
                className="cursor-pointer"
                onClick={() => setPopup(false)}
              />
            </div>

            {popupItems.map((x) => (
              <div
                key={x._id}
                className="border p-2 rounded mb-2 text-sm"
              >
                {x.name}
              </div>
            ))}

          </div>
        </div>
      )}
    </>
  );
}
