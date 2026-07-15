'use client';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NewTaskModal({ projectId, onClose, onSuccess }: { projectId: string, onClose: () => void, onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          project_id: projectId, 
          title, 
          description,
          status,
          priority,
          due_date: dueDate || undefined
        })
      });

      if (!res.ok) {
        throw new Error('Failed to create task');
      }

      toast.success('Task created successfully!');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
        <h2>Create New Task</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)' }}>Task Title</label>
          <input required type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} />
          
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)' }}>Description</label>
          <textarea className="input-field" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          
          <div className="grid-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)' }}>Status</label>
              <select className="input-field" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)' }}>Priority</label>
              <select className="input-field" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)' }}>Due Date</label>
              <input type="date" className="input-field" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>

          {error && <span className="error-text">{error}</span>}
          
          <div className="flex-between" style={{ marginTop: '1rem' }}>
            <button type="button" className="btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
