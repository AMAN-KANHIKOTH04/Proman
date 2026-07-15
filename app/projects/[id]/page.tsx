'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NewTaskModal from '../../../components/NewTaskModal';
import { toast } from 'sonner';

export default function KanbanBoard({ params }: { params: { id: string } }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Handle promise resolving in Next 15 if needed, but works normally in Next 14. 
  // We'll safely access id or default it
  const projectId = params?.id;

  const fetchTasks = async () => {
    if (!projectId) return;
    try {
      const res = await fetch(`/api/tasks?projectId=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error();
    } catch (err) {
      toast.error('Failed to update task status');
      // Revert if failed
      fetchTasks();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const columns = [
    { title: 'To Do', key: 'To Do', className: 'column-todo' },
    { title: 'In Progress', key: 'In Progress', className: 'column-in-progress' },
    { title: 'Done', key: 'Done', className: 'column-done' }
  ];

  return (
    <div>
      <nav className="navbar">
        <Link href="/dashboard" className="nav-brand">
          <div style={{ width: 24, height: 24, background: 'var(--primary)', borderRadius: 4 }}></div>
          Proman
        </Link>
        <Link href="/dashboard" className="btn">Back to Dashboard</Link>
      </nav>

      <main className="container animate-fade-in">
        <div className="flex-between">
          <h1>Kanban Board</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Task</button>
        </div>

        {loading ? (
          <div className="kanban-board">
            {[1, 2, 3].map(i => (
              <div key={i} className="kanban-column">
                <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                <div className="skeleton skeleton-card"></div>
                <div className="skeleton skeleton-card"></div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem' }}>
            <h2 style={{ color: 'var(--foreground)' }}>No tasks here yet</h2>
            <p style={{ marginBottom: '1.5rem' }}>Create a new task to get started.</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Task</button>
          </div>
        ) : (
          <div className="kanban-board">
            {columns.map(col => (
              <div 
                key={col.key} 
                className={`kanban-column ${col.className}`}
                onDrop={(e) => handleDrop(e, col.key)}
                onDragOver={handleDragOver}
              >
                <h3>{col.title} ({tasks.filter(t => t.status === col.key).length})</h3>
                {tasks.filter(t => t.status === col.key).map(task => (
                  <div 
                    key={task.id} 
                    className="task-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                  >
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                      <span className={`task-badge task-priority-${task.priority?.toLowerCase() || 'medium'}`}>{task.priority}</span>
                      {task.due_date && <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{new Date(task.due_date).toLocaleDateString()}</span>}
                    </div>
                    <h4 style={{ margin: '0.5rem 0' }}>{task.title}</h4>
                    {task.description && <p style={{ fontSize: '0.875rem' }}>{task.description}</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <NewTaskModal 
            projectId={projectId}
            onClose={() => setShowModal(false)} 
            onSuccess={() => {
              setShowModal(false);
              fetchTasks();
            }} 
          />
        )}
      </main>
    </div>
  );
}
