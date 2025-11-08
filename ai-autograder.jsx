import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';

export default function AIAutograder() {
  const [userRole, setUserRole] = useState('ta');
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const [assignments, setAssignments] = useState([{
    id: 1,
    title: "Linked List Reversal",
    rubric: "Correctness (70pts), Style (20pts), Efficiency (10pts)",
    testCases: "Empty list → [], Single node → [1], Multiple nodes → [1,2,3] → [3,2,1]"
  }]);
  
  const [submissions, setSubmissions] = useState([{
    id: 1,
    assignmentId: 1,
    studentName: "Demo Student",
    code: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
        if curr is None:  # BUG: Unnecessary
            break
    return prev`,
    status: 'pending',
    grade: null
  }]);

  return (
    <div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .hover-lift { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15); }
      `}</style>
      <div className={`min-h-screen transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className={`backdrop-blur-xl shadow-lg border-b transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-900/80 border-gray-800' 
            : 'bg-white/80 border-gray-200'
        }`}>
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 animate-slideIn">
              <Sparkles className={`w-8 h-8 animate-float ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <h1 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                darkMode 
                  ? 'from-indigo-400 to-purple-400' 
                  : 'from-indigo-600 to-purple-600'
              }`}>
                AI Autograder
              </h1>
            </div>
            <div className="flex gap-2 items-center animate-slideIn" style={{animationDelay: '0.1s'}}>
              {['professor', 'ta', 'student'].map((role, i) => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    userRole === role 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg animate-glow' 
                      : darkMode
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  style={{animationDelay: `${i * 0.1}s`}}
                >
                  {role === 'professor' ? '👨‍🏫 Professor' : role === 'ta' ? '👨‍💻 TA' : '🎓 Student'}
                </button>
              ))}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`ml-4 p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          <div className={mounted ? 'animate-fadeIn' : 'opacity-0'}>
            {userRole === 'professor' && <ProfessorView assignments={assignments} setAssignments={setAssignments} darkMode={darkMode} />}
            {userRole === 'ta' && <TAView submissions={submissions} setSubmissions={setSubmissions} assignments={assignments} darkMode={darkMode} />}
            {userRole === 'student' && <StudentView submissions={submissions} setSubmissions={setSubmissions} assignments={assignments} darkMode={darkMode} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfessorView({ assignments, setAssignments, darkMode }) {
  const [title, setTitle] = useState('');
  const [rubric, setRubric] = useState('');
  const [testCases, setTestCases] = useState('');

  const create = () => {
    if (!title || !rubric) return;
    setAssignments([...assignments, { id: Date.now(), title, rubric, testCases }]);
    setTitle(''); setRubric(''); setTestCases('');
  };

  return (
    <div className="space-y-6">
      <div className={`backdrop-blur-sm rounded-2xl shadow-xl p-6 hover-lift animate-scaleIn ${
        darkMode 
          ? 'bg-gray-900/90 border border-gray-800' 
          : 'bg-white/90 border border-gray-200'
      }`}>
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Create Assignment
        </h2>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Title
            </label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g., Linked List Reversal"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                darkMode 
                  ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
              }`} 
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Rubric
            </label>
            <textarea 
              value={rubric} 
              onChange={e => setRubric(e.target.value)}
              placeholder="Correctness (70pts), Style (20pts)..." 
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                darkMode 
                  ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
              }`} 
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Test Cases
            </label>
            <textarea 
              value={testCases} 
              onChange={e => setTestCases(e.target.value)}
              placeholder="Empty list, Single node..." 
              rows={2}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                darkMode 
                  ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
              }`} 
            />
          </div>
          <button 
            onClick={create} 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            Create Assignment
          </button>
        </div>
      </div>

      <div className={`backdrop-blur-sm rounded-2xl shadow-xl p-6 hover-lift animate-scaleIn ${
        darkMode 
          ? 'bg-gray-900/90 border border-gray-800' 
          : 'bg-white/90 border border-gray-200'
      }`} style={{animationDelay: '0.1s'}}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Assignments ({assignments.length})
        </h2>
        <div className="space-y-3">
          {assignments.map((a, i) => (
            <div 
              key={a.id} 
              className={`border rounded-lg p-4 hover-lift animate-slideIn ${
                darkMode 
                  ? 'border-gray-700 bg-gray-800/50' 
                  : 'border-gray-200 bg-white'
              }`} 
              style={{animationDelay: `${i * 0.05}s`}}
            >
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {a.title}
              </h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {a.rubric}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TAView({ submissions, setSubmissions, assignments, darkMode }) {
  const [selected, setSelected] = useState(null);
  const [grading, setGrading] = useState(false);
  const [results, setResults] = useState(null);

  const gradeSubmission = async (sub) => {
    setSelected(sub);
    setGrading(true);
    setResults(null);

    const assignment = assignments.find(a => a.id === sub.assignmentId);
    
    const prompt = `Grade this CS assignment.

ASSIGNMENT: ${assignment.title}
RUBRIC: ${assignment.rubric}
TEST CASES: ${assignment.testCases}

STUDENT CODE:
\`\`\`python
${sub.code}
\`\`\`

Respond with ONLY valid JSON (no markdown):
{
  "totalScore": 85,
  "maxScore": 100,
  "breakdown": [
    {"category": "Correctness", "score": 60, "max": 70, "reason": "explanation"},
    {"category": "Style", "score": 20, "max": 20, "reason": "explanation"},
    {"category": "Efficiency", "score": 5, "max": 10, "reason": "explanation"}
  ],
  "feedback": "2-3 sentence summary",
  "issues": [{"line": 10, "issue": "description"}],
  "strengths": ["what they did well"]
}`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      let text = data.content[0].text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      setResults(JSON.parse(text));
    } catch (err) {
      console.error(err);
      alert('Grading failed: ' + err.message);
    } finally {
      setGrading(false);
    }
  };

  const approveGrade = () => {
    setSubmissions(submissions.map(s => 
      s.id === selected.id 
        ? { ...s, status: 'graded', grade: results }
        : s
    ));
    setSelected(null);
    setResults(null);
  };

  const pending = submissions.filter(s => s.status === 'pending');

  return (
    <div className="space-y-6">
      <div className={`backdrop-blur-sm rounded-2xl shadow-xl p-6 hover-lift animate-scaleIn ${
        darkMode 
          ? 'bg-gray-900/90 border border-gray-800' 
          : 'bg-white/90 border border-gray-200'
      }`}>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Grading Queue ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No pending submissions</p>
        ) : (
          <div className="space-y-3">
            {pending.map((sub, i) => (
              <div 
                key={sub.id} 
                className={`border rounded-lg p-4 flex justify-between items-center hover-lift animate-slideIn ${
                  darkMode 
                    ? 'border-gray-700 bg-gray-800/50' 
                    : 'border-gray-200 bg-white'
                }`} 
                style={{animationDelay: `${i * 0.05}s`}}
              >
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {sub.studentName}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {assignments.find(a => a.id === sub.assignmentId)?.title}
                  </p>
                </div>
                <button 
                  onClick={() => gradeSubmission(sub)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Grade
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className={`backdrop-blur-sm rounded-2xl shadow-xl p-6 hover-lift animate-scaleIn ${
          darkMode 
            ? 'bg-gray-900/90 border border-gray-800' 
            : 'bg-white/90 border border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Grading: {selected.studentName}
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Student Code
              </h3>
              <pre className={`p-4 rounded-lg text-sm font-mono overflow-x-auto border ${
                darkMode 
                  ? 'bg-gray-950 text-gray-200 border-gray-800' 
                  : 'bg-gray-50 text-gray-800 border-gray-200'
              }`}>
                {selected.code}
              </pre>
            </div>

            <div>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Analysis
              </h3>
              {grading ? (
                <div className={`flex items-center gap-2 animate-fadeIn ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <Clock className="w-5 h-5 animate-spin" />
                  Analyzing code...
                </div>
              ) : results ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className={`rounded-lg p-4 text-center animate-scaleIn border ${
                    darkMode 
                      ? 'bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border-indigo-800' 
                      : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
                  }`}>
                    <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {results.totalScore}/{results.maxScore}
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Breakdown
                    </h4>
                    {results.breakdown.map((b, i) => (
                      <div 
                        key={i} 
                        className={`border rounded-lg p-3 mb-2 hover-lift animate-slideIn ${
                          darkMode 
                            ? 'border-gray-700 bg-gray-800/50' 
                            : 'border-gray-200 bg-white'
                        }`} 
                        style={{animationDelay: `${i * 0.05}s`}}
                      >
                        <div className="flex justify-between mb-1">
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {b.category}
                          </span>
                          <span className={`font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                            {b.score}/{b.max}
                          </span>
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {b.reason}
                        </p>
                      </div>
                    ))}
                  </div>

                  {results.issues?.length > 0 && (
                    <div className="animate-fadeIn">
                      <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Issues
                      </h4>
                      {results.issues.map((issue, i) => (
                        <div 
                          key={i} 
                          className={`border rounded-lg p-2 text-sm mb-2 animate-slideIn ${
                            darkMode 
                              ? 'bg-yellow-950/30 border-yellow-800 text-yellow-200' 
                              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                          }`} 
                          style={{animationDelay: `${i * 0.05}s`}}
                        >
                          <span className="font-mono font-semibold">Line {issue.line}:</span> {issue.issue}
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    onClick={approveGrade}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  >
                    Approve & Finalize
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentView({ submissions, setSubmissions, assignments, darkMode }) {
  const [code, setCode] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(assignments[0]?.id);

  const submit = () => {
    if (!code.trim()) return;
    setSubmissions([...submissions, {
      id: Date.now(),
      assignmentId: selectedAssignment,
      studentName: "You",
      code,
      status: 'pending',
      grade: null
    }]);
    setCode('');
  };

  const mySubmissions = submissions.filter(s => s.studentName === "You");

  return (
    <div className="space-y-6">
      <div className={`backdrop-blur-sm rounded-2xl shadow-xl p-6 hover-lift animate-scaleIn ${
        darkMode 
          ? 'bg-gray-900/90 border border-gray-800' 
          : 'bg-white/90 border border-gray-200'
      }`}>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Submit Code
        </h2>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Assignment
            </label>
            <select 
              value={selectedAssignment} 
              onChange={e => setSelectedAssignment(Number(e.target.value))}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                darkMode 
                  ? 'border-gray-700 bg-gray-800 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              {assignments.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Your Code
            </label>
            <textarea 
              value={code} 
              onChange={e => setCode(e.target.value)}
              placeholder="Paste your code here..." 
              rows={15}
              className={`w-full px-4 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                darkMode 
                  ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
              }`} 
            />
          </div>
          <button 
            onClick={submit}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            Submit Assignment
          </button>
        </div>
      </div>

      <div className={`backdrop-blur-sm rounded-2xl shadow-xl p-6 hover-lift animate-scaleIn ${
        darkMode 
          ? 'bg-gray-900/90 border border-gray-800' 
          : 'bg-white/90 border border-gray-200'
      }`} style={{animationDelay: '0.1s'}}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          My Submissions
        </h2>
        {mySubmissions.length === 0 ? (
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No submissions yet</p>
        ) : (
          <div className="space-y-3">
            {mySubmissions.map((sub, i) => {
              const assignment = assignments.find(a => a.id === sub.assignmentId);
              return (
                <div 
                  key={sub.id} 
                  className={`border rounded-lg p-4 hover-lift animate-slideIn ${
                    darkMode 
                      ? 'border-gray-700 bg-gray-800/50' 
                      : 'border-gray-200 bg-white'
                  }`} 
                  style={{animationDelay: `${i * 0.05}s`}}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {assignment?.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 border ${
                      sub.status === 'graded' 
                        ? darkMode
                          ? 'bg-green-950/50 text-green-300 border-green-800'
                          : 'bg-green-100 text-green-800 border-green-200'
                        : darkMode
                          ? 'bg-yellow-950/50 text-yellow-300 border-yellow-800'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      {sub.status === 'graded' ? '✓ Graded' : '⏳ Pending'}
                    </span>
                  </div>

                  {sub.status === 'graded' && sub.grade && (
                    <div className={`mt-4 pt-4 border-t animate-fadeIn ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        {sub.grade.totalScore}/{sub.grade.maxScore} ({Math.round(sub.grade.totalScore/sub.grade.maxScore*100)}%)
                      </div>
                      
                      <div className="space-y-2">
                        {sub.grade.breakdown.map((b, i) => (
                          <div 
                            key={i} 
                            className={`flex justify-between text-sm ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            <span>{b.category}</span>
                            <span className={`font-semibold ${
                              darkMode ? 'text-indigo-400' : 'text-indigo-600'
                            }`}>
                              {b.score}/{b.max}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className={`mt-3 p-3 rounded-lg text-sm border ${
                        darkMode 
                          ? 'bg-gradient-to-r from-blue-950/30 to-indigo-950/30 text-blue-200 border-blue-800' 
                          : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 border-blue-200'
                      }`}>
                        <strong>Feedback:</strong> {sub.grade.feedback}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
