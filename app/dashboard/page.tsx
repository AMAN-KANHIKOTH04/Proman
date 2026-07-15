'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectList from '../../components/ProjectList';
import NewProjectModal from '../../components/NewProjectModal';
import Link from 'next/link';

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [userName, setUserName] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('proman_user_id');
    if (!userId) {
      router.push('/login');
      return;
    }
    setUserName(localStorage.getItem('proman_user_name') || 'User');
    fetchProjects();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('proman_user_id');
    localStorage.removeItem('proman_user_name');
    router.push('/login');
  };

  const totalTasks = projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  
  // Calculate due today
  const today = new Date().toISOString().split('T')[0];
  const tasksDueToday = projects.flatMap(p => p.tasks || []).filter(t => {
    if (!t.due_date) return false;
    return new Date(t.due_date).toISOString().split('T')[0] === today;
  }).length;

  return (
    <div>
      <nav className="navbar">
        <Link href="/dashboard" className="nav-brand">
          <div style={{ width: 24, height: 24, background: 'var(--primary)', borderRadius: 4 }}></div>
          Proman
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Welcome, {userName}</span>
          <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="container animate-fade-in">
        <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>
        
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          <div className="glass-panel">
            <h3 style={{ color: 'var(--muted)' }}>Total Projects</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{loading ? '-' : projects.length}</div>
          </div>
          <div className="glass-panel">
            <h3 style={{ color: 'var(--muted)' }}>Total Tasks</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{loading ? '-' : totalTasks}</div>
          </div>
          <div className="glass-panel">
            <h3 style={{ color: 'var(--muted)' }}>Tasks Due Today</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>{loading ? '-' : tasksDueToday}</div>
          </div>
        </div>

        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2>Your Projects</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Project</button>
        </div>

        <ProjectList projects={projects} loading={loading} />

        {showModal && (
          <NewProjectModal 
            onClose={() => setShowModal(false)} 
            onSuccess={() => {
              setShowModal(false);
              fetchProjects();
            }} 
          />
        )}
      </main>
    </div>
  );
}
