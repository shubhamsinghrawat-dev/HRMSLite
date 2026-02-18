import { useState } from 'react';
import { HiCheck, HiX, HiCalendar, HiRefresh, HiClipboardList, HiUserGroup, HiClock } from 'react-icons/hi';
import { Button, Table, Modal, Card } from '../components';
import { useEmployees } from '../hooks/useEmployees';
import { useAttendance, useEmployeeHistory, useMarkAttendance } from '../hooks/useAttendance';

export default function Attendance() {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDate, setFilterDate] = useState('');

  const { employees, loading: employeesLoading } = useEmployees();
  const { attendanceRecords, loading: attendanceLoading, refetch: refetchAttendance } = useAttendance(filterDate);
  const { employeeHistory, historyLoading, isOpen: isHistoryModalOpen, fetchHistory, closeHistory } = useEmployeeHistory();
  const { markAttendance: submitAttendance, submitting } = useMarkAttendance(() => {
    setSelectedEmployee('');
    refetchAttendance();
  });

  const loading = employeesLoading || attendanceLoading;

  const handleMarkAttendance = (status) => {
    submitAttendance(selectedEmployee, selectedDate, status);
  };

  const getStatusBadge = (status) => {
    if (status === 'Present') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          Present
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
        Absent
      </span>
    );
  };

  const attendanceColumns = [
    {
      key: 'employee_code',
      label: 'Employee ID',
      render: (row) => (
        <span className="font-mono text-sm bg-zinc-100 px-2 py-1 rounded text-zinc-600">
          {row.employee_code}
        </span>
      ),
    },
    {
      key: 'employee_name',
      label: 'Employee Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-medium text-sm">
            {row.employee_name?.charAt(0) || '?'}
          </div>
          <span className="font-medium text-zinc-900">{row.employee_name}</span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => (
        <div className="flex items-center gap-2 text-zinc-600 text-sm">
          <HiCalendar className="w-4 h-4 text-zinc-400" />
          {new Date(row.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => getStatusBadge(row.status),
    },
  ];

  const employeeColumns = [
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
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-medium text-sm">
            {row.full_name?.charAt(0) || '?'}
          </div>
          <span className="font-medium text-zinc-900">{row.full_name}</span>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">
          {row.department}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button size="sm" variant="outline" onClick={() => fetchHistory(row.id)} icon={HiClipboardList}>
          View History
        </Button>
      ),
    },
  ];

  const selectedEmp = employees.find(e => e.id === selectedEmployee);

  return (
    <div className="space-y-6">
      {/* Mark Attendance Section */}
      <div className="bg-white rounded-lg ring-1 ring-zinc-900/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="bg-violet-600 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-md">
              <HiCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Mark Attendance</h2>
              <p className="text-violet-200 text-sm">Record daily attendance for employees</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Employee Select */}
            <div className="lg:col-span-5">
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Select Employee <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors text-zinc-700"
              >
                <option value="">Choose an employee...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employee_id} - {emp.full_name}
                  </option>
                ))}
              </select>
              {selectedEmp && (
                <div className="mt-2 p-3 bg-violet-50 rounded-md border border-violet-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-violet-600 rounded-lg flex items-center justify-center text-white font-medium">
                      {selectedEmp.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">{selectedEmp.full_name}</p>
                      <p className="text-sm text-zinc-500">{selectedEmp.department}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Date Select */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Select Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors text-zinc-700"
              />
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-4 flex items-end gap-2">
              <Button
                variant="success"
                onClick={() => handleMarkAttendance('Present')}
                loading={submitting}
                disabled={!selectedEmployee || !selectedDate}
                className="flex-1"
                icon={HiCheck}
              >
                Present
              </Button>
              <Button
                variant="danger"
                onClick={() => handleMarkAttendance('Absent')}
                loading={submitting}
                disabled={!selectedEmployee || !selectedDate}
                className="flex-1"
                icon={HiX}
              >
                Absent
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-50 rounded-md">
              <HiClipboardList className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900">Attendance Records</h2>
              <p className="text-zinc-500 text-sm">View and filter attendance history</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors text-sm text-zinc-700"
                placeholder="Filter by date"
              />
            </div>
            {filterDate && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setFilterDate('')}
                icon={HiRefresh}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        <Table
          columns={attendanceColumns}
          data={attendanceRecords}
          loading={loading}
          emptyMessage="No attendance records found. Start by marking attendance above."
        />
      </div>

      {/* Employee Attendance History Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-50 rounded-md">
            <HiUserGroup className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">Employee History</h2>
            <p className="text-zinc-500 text-sm">View detailed attendance history per employee</p>
          </div>
        </div>
        <Table
          columns={employeeColumns}
          data={employees}
          loading={loading}
          emptyMessage="No employees found. Add employees first to track attendance."
        />
      </div>

      {/* Employee History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={closeHistory}
        title="Attendance History"
        size="lg"
        icon={HiClipboardList}
      >
        {historyLoading ? (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-100 rounded-lg mb-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-zinc-200 border-t-violet-600"></div>
            </div>
            <p className="text-zinc-500 text-sm">Loading attendance history...</p>
          </div>
        ) : employeeHistory ? (
          <div className="space-y-5">
            {/* Employee Info */}
            <div className="bg-zinc-50 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                  {employeeHistory.employee.full_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">
                    {employeeHistory.employee.full_name}
                  </h3>
                  <p className="text-sm text-zinc-500 flex items-center gap-2">
                    <span className="font-mono bg-zinc-200 px-1.5 py-0.5 rounded text-xs">
                      {employeeHistory.employee.employee_id}
                    </span>
                    <span>•</span>
                    <span>{employeeHistory.employee.department}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <Card
                title="Total Days"
                value={employeeHistory.stats.total_days}
                icon={HiCalendar}
                color="blue"
              />
              <Card
                title="Present"
                value={employeeHistory.stats.present_days}
                icon={HiCheck}
                color="green"
              />
              <Card
                title="Absent"
                value={employeeHistory.stats.absent_days}
                icon={HiX}
                color="red"
              />
            </div>

            {/* Attendance Records */}
            <div>
              <h4 className="font-medium text-zinc-900 mb-2 flex items-center gap-2">
                <HiClock className="w-4 h-4 text-zinc-400" />
                Recent Records
              </h4>
              {employeeHistory.records.length > 0 ? (
                <div className="max-h-56 overflow-y-auto rounded-lg border border-zinc-200">
                  <table className="min-w-full">
                    <thead className="bg-zinc-50/60 sticky top-0">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 bg-white">
                      {employeeHistory.records.map((record) => (
                        <tr key={record.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-4 py-2.5 text-sm text-zinc-700">
                            {new Date(record.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-4 py-2.5">{getStatusBadge(record.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 bg-zinc-50 rounded-lg">
                  <HiClipboardList className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                  <p className="text-sm text-zinc-500">No attendance records found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-4 border-t border-zinc-100">
              <Button variant="secondary" onClick={closeHistory}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
