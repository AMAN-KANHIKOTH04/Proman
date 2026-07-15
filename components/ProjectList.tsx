'use client';
import { useRouter } from 'next/navigation';

export default function ProjectList({ projects, loading }: { projects: any[], loading: boolean }) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="grid-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-panel skeleton skeleton-card"></div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: 'var(--foreground)' }}>No projects found</h2>
        <p style={{ marginBottom: '1.5rem' }}>You don't have any projects yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid-3">
      {projects.map(project => (
        <div key={project.id} className="glass-panel" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => router.push(`/projects/${project.id}`)} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <h3>{project.name}</h3>
          <p style={{ margin: '0.5rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description || 'No description'}</p>
          <div className="flex-between" style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--primary)' }}>{project.tasks?.length || 0} Tasks</span>
            <span style={{ color: 'var(--muted)' }}>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
