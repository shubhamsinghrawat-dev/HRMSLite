import { useState } from 'react';
import { HiPlus, HiTrash, HiEye, HiUserAdd, HiMail, HiOfficeBuilding, HiIdentification, HiUser, HiCalendar, HiExclamationCircle } from 'react-icons/hi';
import { Button, Table, Modal, Input, ConfirmDialog } from '../components';
import { useEmployees, useCreateEmployee, useDeleteEmployee } from '../hooks/useEmployees';

const departments = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Design',
  'Product',
];

export default function Employees() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [localErrors, setLocalErrors] = useState({});

  const { employees, loading, refetch } = useEmployees();
  const { createEmployee, submitting: createSubmitting, errors: apiErrors, setErrors: setApiErrors, clearErrors } = useCreateEmployee(() => {
    setIsModalOpen(false);
    setFormData({ employee_id: '', full_name: '', email: '', department: '' });
    refetch();
  });
  const { deleteEmployee, submitting: deleteSubmitting } = useDeleteEmployee(() => {
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
    refetch();
  });

  const errors = { ...localErrors, ...apiErrors };
  const submitting = createSubmitting || deleteSubmitting;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (localErrors[name]) {
      setLocalErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiErrors[name]) {
      setApiErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employee_id.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.employee_id)) {
      newErrors.employee_id = 'Employee ID must be alphanumeric';
    }
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    createEmployee(formData);
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    deleteEmployee(selectedEmployee.id);
  };

  const openViewModal = (employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };

  const openDeleteDialog = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const closeAddModal = () => {
    setIsModalOpen(false);
    setFormData({ employee_id: '', full_name: '', email: '', department: '' });
    setLocalErrors({});
    clearErrors();
  };

  const columns = [
    {
      key: 'employee_id',
      label: 'Employee ID',
      render: (row) => (
        <span className="font-mono text-sm bg-zinc-100 px-2 py-1 rounded text-zinc-600">
          {row.employee_id}
        </span>
      ),
    },
    {
      key: 'full_name',
      label: 'Full Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-600 rounded-lg flex items-center justify-center text-white font-medium text-sm">
            {row.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-medium text-zinc-900">{row.full_name}</p>
            <p className="text-xs text-zinc-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700">
          <HiOfficeBuilding className="w-3.5 h-3.5 text-zinc-500" />
          {row.department}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (row) => (
        <span className="text-sm text-zinc-500">
          {new Date(row.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openViewModal(row)}
            className="p-2 text-zinc-400 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors"
            title="View Details"
          >
            <HiEye className="w-5 h-5" />
          </button>
          <button
            onClick={() => openDeleteDialog(row)}
            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <HiTrash className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
            <HiUser className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">Employees</h1>
            <p className="text-sm text-zinc-500">Manage your organization's workforce</p>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={HiPlus}>
          Add Employee
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-lg ring-1 ring-zinc-900/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
              <HiUser className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xl font-semibold text-zinc-900">{employees.length}</p>
              <p className="text-sm text-zinc-500">Total Employees</p>
            </div>
          </div>
          <div className="w-px h-10 bg-zinc-200" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <HiOfficeBuilding className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-semibold text-zinc-900">
                {new Set(employees.map(e => e.department)).size}
              </p>
              <p className="text-sm text-zinc-500">Departments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={employees}
        loading={loading}
        emptyMessage="No employees found. Click 'Add Employee' to add your first team member."
      />

      {/* Add Employee Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeAddModal}
        title="Add New Employee"
        icon={HiUserAdd}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Employee ID"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleInputChange}
            error={errors.employee_id?.[0] || errors.employee_id}
            placeholder="e.g., EMP001"
            icon={HiIdentification}
            required
            helper="Unique alphanumeric identifier"
          />
          <Input
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            error={errors.full_name?.[0] || errors.full_name}
            placeholder="e.g., John Doe"
            icon={HiUser}
            required
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email?.[0] || errors.email}
            placeholder="e.g., john@company.com"
            icon={HiMail}
            required
          />
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Department <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <HiOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 z-10" />
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 bg-white border rounded-md appearance-none transition-colors
                  focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                  ${errors.department ? 'border-rose-300 bg-rose-50' : 'border-zinc-200'}`}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            {errors.department && (
              <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1.5">
                <HiExclamationCircle className="w-4 h-4" />
                {errors.department?.[0] || errors.department}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
            <Button
              type="button"
              variant="secondary"
              onClick={closeAddModal}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting} icon={HiPlus}>
              Add Employee
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Employee Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedEmployee(null);
        }}
        title="Employee Details"
        icon={HiUser}
      >
        {selectedEmployee && (
          <div className="space-y-5">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-lg">
              <div className="w-14 h-14 bg-violet-600 rounded-xl flex items-center justify-center text-white font-semibold text-xl">
                {selectedEmployee.full_name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">{selectedEmployee.full_name}</h3>
                <p className="text-sm text-zinc-500">{selectedEmployee.department}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-50 rounded-lg">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <HiIdentification className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Employee ID</span>
                </div>
                <p className="font-mono font-medium text-zinc-900">{selectedEmployee.employee_id}</p>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <HiOfficeBuilding className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Department</span>
                </div>
                <p className="font-medium text-zinc-900">{selectedEmployee.department}</p>
              </div>
              <div className="col-span-2 p-3 bg-zinc-50 rounded-lg">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <HiMail className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Email Address</span>
                </div>
                <p className="font-medium text-zinc-900">{selectedEmployee.email}</p>
              </div>
              <div className="col-span-2 p-3 bg-zinc-50 rounded-lg">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <HiCalendar className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Joined Date</span>
                </div>
                <p className="font-medium text-zinc-900">
                  {new Date(selectedEmployee.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
              <Button
                variant="danger"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openDeleteDialog(selectedEmployee);
                }}
                icon={HiTrash}
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedEmployee(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedEmployee(null);
        }}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee?.full_name}? This will also remove all their attendance records. This action cannot be undone.`}
        confirmText="Delete Employee"
        loading={submitting}
      />
    </div>
  );
}
