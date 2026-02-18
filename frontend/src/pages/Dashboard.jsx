import { Link } from 'react-router-dom';
import { HiUsers, HiCheck, HiX, HiClock, HiRefresh, HiArrowRight, HiChartBar } from 'react-icons/hi';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Card, Table, Button } from '../components';
import { useDashboard } from '../hooks/useDashboard';

ChartJS.register(ArcElement, Tooltip);

export default function Dashboard() {
  const { data, loading, attendanceRate, refetch } = useDashboard();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white rounded-lg ring-1 ring-zinc-900/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
          <div className="h-6 bg-zinc-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-zinc-100 rounded w-72"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg ring-1 ring-zinc-900/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 bg-zinc-200 rounded-lg"></div>
                <div className="h-4 w-12 bg-zinc-100 rounded"></div>
              </div>
              <div className="h-7 bg-zinc-200 rounded w-16 mb-1"></div>
              <div className="h-4 bg-zinc-100 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statsColumns = [
    {
      key: 'employee_code',
      label: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center text-white font-medium text-sm">
            {row.employee_name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-medium text-zinc-900">{row.employee_name}</p>
            <p className="text-sm text-zinc-500">{row.employee_code}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'present_days',
      label: 'Present Days',
      render: (row) => (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 w-fit">
          <HiCheck className="w-4 h-4" />
          <span className="font-medium">{row.present_days}</span>
          <span className="text-sm">days</span>
        </div>
      ),
    },
    {
      key: 'attendance_rate',
      label: 'Performance',
      render: (row) => {
        const rate = row.present_days > 0 ? Math.min(100, row.present_days * 5) : 0;
        return (
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-20 bg-zinc-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-600 transition-all duration-300"
                style={{ width: `${rate}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-zinc-600">{rate}%</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg p-6 ring-1 ring-zinc-900/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-zinc-500 text-sm mb-1">{getGreeting()}</p>
            <h1 className="text-2xl font-semibold text-zinc-900 mb-1">Welcome to HRMS Lite</h1>
            <p className="text-zinc-500">Manage your workforce efficiently</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-zinc-100 rounded-md px-4 py-2">
              <p className="text-zinc-500 text-xs mb-0.5">Today</p>
              <p className="font-medium text-zinc-900">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={refetch}
              icon={HiRefresh}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Total Employees"
          value={data?.total_employees || 0}
          icon={HiUsers}
          color="teal"
        />
        <Card
          title="Present Today"
          value={data?.today?.present || 0}
          icon={HiCheck}
          color="green"
          subtitle={`${attendanceRate}% attendance rate`}
        />
        <Card
          title="Absent Today"
          value={data?.today?.absent || 0}
          icon={HiX}
          color="red"
          subtitle={`of ${data?.total_employees || 0} employees`}
        />
        <Card
          title="Not Marked"
          value={data?.today?.not_marked || 0}
          icon={HiClock}
          color="yellow"
          subtitle="Pending attendance"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Overview */}
        <div className="lg:col-span-2 bg-white rounded-lg ring-1 ring-zinc-900/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-50 rounded-md">
                <HiChartBar className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900">Today's Attendance</h2>
                <p className="text-sm text-zinc-500">Real-time overview</p>
              </div>
            </div>
          </div>

          {data?.total_employees > 0 ? (
            <div className="space-y-4">
              {/* Present Bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-medium text-zinc-700">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-zinc-900">{data?.today?.present || 0}</span>
                    <span className="text-sm text-zinc-500">
                      ({Math.round((data?.today?.present / data?.total_employees) * 100) || 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${Math.round((data?.today?.present / data?.total_employees) * 100) || 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Absent Bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <span className="text-sm font-medium text-zinc-700">Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-zinc-900">{data?.today?.absent || 0}</span>
                    <span className="text-sm text-zinc-500">
                      ({Math.round((data?.today?.absent / data?.total_employees) * 100) || 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-rose-500 transition-all duration-500"
                    style={{
                      width: `${Math.round((data?.today?.absent / data?.total_employees) * 100) || 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Not Marked Bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-medium text-zinc-700">Not Marked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-zinc-900">{data?.today?.not_marked || 0}</span>
                    <span className="text-sm text-zinc-500">
                      ({Math.round((data?.today?.not_marked / data?.total_employees) * 100) || 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-500"
                    style={{
                      width: `${Math.round((data?.today?.not_marked / data?.total_employees) * 100) || 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Doughnut Chart */}
              <div className="mt-6 pt-6 border-t border-zinc-100">
                <div className="flex items-center justify-center">
                  <div className="relative w-28 h-28">
                    <Doughnut
                      data={{
                        datasets: [{
                          data: [attendanceRate, 100 - attendanceRate],
                          backgroundColor: ['#7c3aed', '#e4e4e7'],
                          borderWidth: 0,
                          cutout: '75%',
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: { tooltip: { enabled: false } },
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-zinc-900">{attendanceRate}%</span>
                      <span className="text-xs text-zinc-500">Attendance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 bg-zinc-100 rounded-lg flex items-center justify-center mb-3">
                <HiUsers className="w-7 h-7 text-zinc-400" />
              </div>
              <h3 className="font-medium text-zinc-900 mb-1">No Employees Yet</h3>
              <p className="text-sm text-zinc-500 mb-4">Add employees to start tracking attendance</p>
              <Link to="/employees">
                <Button variant="primary" icon={HiUsers}>
                  Add Employees
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg ring-1 ring-zinc-900/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
            <h2 className="font-semibold text-zinc-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/employees"
                className="group flex items-center justify-between p-3 bg-zinc-50 rounded-md hover:bg-violet-50 transition-colors border border-transparent hover:border-violet-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-md shadow-sm">
                    <HiUsers className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <span className="font-medium text-zinc-900 block text-sm">Manage Employees</span>
                    <p className="text-xs text-zinc-500">Add, view, or remove</p>
                  </div>
                </div>
                <HiArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-violet-600 transition-colors" />
              </Link>

              <Link
                to="/attendance"
                className="group flex items-center justify-between p-3 bg-zinc-50 rounded-md hover:bg-violet-50 transition-colors border border-transparent hover:border-violet-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-md shadow-sm">
                    <HiCheck className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <span className="font-medium text-zinc-900 block text-sm">Mark Attendance</span>
                    <p className="text-xs text-zinc-500">Record daily status</p>
                  </div>
                </div>
                <HiArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-violet-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-zinc-900 rounded-lg p-5 text-white">
            <h2 className="font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span className="text-zinc-400 text-sm">Total Employees</span>
                <span className="text-xl font-semibold">{data?.total_employees || 0}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span className="text-zinc-400 text-sm">Attendance Rate</span>
                <span className="text-xl font-semibold text-violet-400">{attendanceRate}%</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-400 text-sm">Pending Actions</span>
                <span className="text-xl font-semibold text-amber-400">{data?.today?.not_marked || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Statistics Table */}
      <div className="bg-white rounded-lg ring-1 ring-zinc-900/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-50 rounded-md">
                <HiChartBar className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900">Employee Statistics</h2>
                <p className="text-sm text-zinc-500">All-time attendance records</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-md text-sm font-medium">
              {data?.employee_stats?.length || 0} employees
            </span>
          </div>
        </div>
        <div className="p-5">
          <Table
            columns={statsColumns}
            data={data?.employee_stats || []}
            loading={loading}
            emptyMessage="No attendance data available yet. Start marking attendance to see statistics here."
          />
        </div>
      </div>
    </div>
  );
}
