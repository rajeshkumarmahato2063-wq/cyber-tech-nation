import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { faqService } from '../../services/faq';

/**
 * FAQ Editor CRUD Component
 */
const FAQEditor = ({ faqs = [], onRefresh }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !answer) return;

    setLoading(true);
    try {
      await faqService.addFAQ({ question, answer, displayOrder: faqs.length });
      setQuestion('');
      setAnswer('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(`Add FAQ error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this FAQ entry?')) {
      try {
        await faqService.deleteFAQ(id);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert(`Delete FAQ error: ${err.message}`);
      }
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Create FAQ Form */}
      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
          <HelpCircle className="w-4 h-4" /> Add FAQ Question & Answer
        </h4>

        <input
          type="text"
          required
          placeholder="Question (e.g. Is there any registration fee?)..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="cyber-input"
        />

        <textarea
          rows={3}
          required
          placeholder="Answer details..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="cyber-input resize-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-[#050816] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {loading ? 'Saving...' : 'Save FAQ Entry'}
        </button>
      </form>

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.map((f, idx) => (
          <div key={f.id || idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">
                Q{idx + 1}: {f.question}
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">{f.answer}</p>
            </div>

            <button
              onClick={() => handleDelete(f.id)}
              className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors shrink-0"
              title="Delete FAQ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQEditor;
