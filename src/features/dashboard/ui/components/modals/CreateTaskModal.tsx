import { useState, useEffect } from "react";
import { CloseModalIcon, TasksIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { getModalInputClass } from "../../utils/modalStyles";
import { useGetAllEmployeesQuery, useCreateTaskMutation } from "@features/dashboard/api/dashboard-api";

type CreateTaskModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly milestoneId: number;
  readonly onSuccess?: () => void;
};

export const CreateTaskModal = ({
  tokens,
  isOpen,
  onClose,
  milestoneId,
  onSuccess
}: CreateTaskModalProps) => {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedPriorities, setSelectedPriorities] = useState<Set<string>>(new Set(["Low"]));
  const [selectedEmployees, setSelectedEmployees] = useState<Set<number>>(new Set());

  const { data: employeesData, isLoading: isLoadingEmployees } = useGetAllEmployeesQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setLabel("");
      setDescription("");
      setStartDate("");
      setDueDate("");
      setSelectedPriorities(new Set(["Low"]));
      setSelectedEmployees(new Set());
    }
  }, [isOpen]);

  const handleCreate = async () => {
    if (!label.trim() || !description.trim() || !startDate || !dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    // Use the first selected priority or default to "Low"
    const priority = Array.from(selectedPriorities)[0] || "Low";

    try {
      await createTask({
        label: label.trim(),
        description: description.trim(),
        start_date: startDate,
        due_date: dueDate,
        assigned_employees: Array.from(selectedEmployees),
        priority,
        milestone_id: milestoneId
      }).unwrap();

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleClose = () => {
    setLabel("");
    setDescription("");
    setStartDate("");
    setDueDate("");
    setSelectedPriorities(new Set(["Low"]));
    setSelectedEmployees(new Set());
    onClose();
  };

  const inputClass = getModalInputClass(tokens, { paddingY: "py-3", textColor: "text-[#2B3674]" });

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className={`relative w-full max-w-2xl ${tokens.cardBase} ${tokens.isDark ? "bg-[#0F1217]" : "bg-white"} rounded-[20px] max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className={`flex flex-wrap items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 rounded-t-2xl ${
              tokens.isDark ? "bg-[#0F1217]" : "bg-[#FFFEF7]"
            }`}>
              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}>
                  <TasksIcon className={`h-5 w-5`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
                </div>
                <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Create New Task
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <CloseModalIcon className="h-6 w-6 md:h-7 md:w-7" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pt-6 px-6">
              <div className="flex flex-col gap-6">
                {/* Task Label */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Task Label *
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className={inputClass}
                    placeholder="Enter task label"
                  />
                </div>

                {/* Description */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${inputClass} min-h-[100px] resize-none`}
                    placeholder="Enter task description"
                  />
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label 
                      className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                        tokens.isDark 
                          ? "text-white/70 bg-[#0F1217]" 
                          : "text-black bg-white"
                      }`}
                    >
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="relative">
                    <label 
                      className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                        tokens.isDark 
                          ? "text-white/70 bg-[#0F1217]" 
                          : "text-black bg-white"
                      }`}
                    >
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Priority */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Priority
                  </label>
                  <select
                    multiple
                    value={Array.from(selectedPriorities)}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                      setSelectedPriorities(new Set(selected));
                    }}
                    className={`${inputClass} min-h-[80px]`}
                  >
                    <option value="Low">Low</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                  <p className={`text-xs mt-1 ${tokens.subtleText}`}>
                    Hold Ctrl (Cmd on Mac) to select multiple priorities
                  </p>
                </div>

                {/* Assign Employees */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Assign Employees
                  </label>
                  {isLoadingEmployees ? (
                    <div className={inputClass}>
                      <p className={`text-sm ${tokens.subtleText}`}>Loading employees...</p>
                    </div>
                  ) : employeesData?.data && employeesData.data.length > 0 ? (
                    <select
                      multiple
                      value={Array.from(selectedEmployees).map(String)}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
                        setSelectedEmployees(new Set(selected));
                      }}
                      className={`${inputClass} min-h-[120px]`}
                    >
                      {employeesData.data.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role} ({employee.email})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className={inputClass}>
                      <p className={`text-sm ${tokens.subtleText}`}>No employees available</p>
                    </div>
                  )}
                  <p className={`text-xs mt-1 ${tokens.subtleText}`}>
                    Hold Ctrl (Cmd on Mac) to select multiple employees
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
              <button
                type="button"
                onClick={handleCreate}
                disabled={isCreating}
                className={`w-full py-3.5 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  tokens.isDark
                    ? "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
                    : "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
                }`}
              >
                {isCreating ? "Creating..." : "Create Task"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isCreating}
                className={`w-full px-6 py-2.5 rounded-full text-base font-medium transition-colors disabled:opacity-50 ${
                  tokens.isDark
                    ? "border border-white/20 text-white hover:bg-white/10 bg-transparent"
                    : "border border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/10 bg-white"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
