'use client';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NewProjectModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const owner_id = localStorage.getItem('proman_user_id');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, owner_id })
      });

      if (!res.ok) {
        throw new Error('Failed to create project');
      }

      toast.success('Project created successfully!');
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
        <h2>Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)' }}>Project Name</label>
          <input required type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} />
          
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)' }}>Description</label>
          <textarea className="input-field" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          
          {error && <span className="error-text">{error}</span>}
          
          <div className="flex-between" style={{ marginTop: '1rem' }}>
            <button type="button" className="btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
