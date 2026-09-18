import { useState } from 'react';
import { Award, CheckCircle, RefreshCw } from 'lucide-react';
import { submitProjectScore } from '../services/judge';

/**
 * Reusable Judge Evaluation Scorecard Component (100 Marks Total)
 */
const JudgeScoreCard = ({ judgeId, registration, existingScore, onScoreSubmitted }) => {
  const [innovation, setInnovation] = useState(existingScore?.innovation_score || 0);
  const [technical, setTechnical] = useState(existingScore?.technical_score || 0);
  const [feasibility, setFeasibility] = useState(existingScore?.feasibility_score || 0);
  const [presentation, setPresentation] = useState(existingScore?.presentation_score || 0);
  const [impact, setImpact] = useState(existingScore?.impact_score || 0);
  const [comments, setComments] = useState(existingScore?.comments || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(Boolean(existingScore));

  const totalScore = Number(innovation) + Number(technical) + Number(feasibility) + Number(presentation) + Number(impact);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitProjectScore({
        judgeId,
        registrationId: registration.id,
        innovationScore: innovation,
        technicalScore: technical,
        feasibilityScore: feasibility,
        presentationScore: presentation,
        impactScore: impact,
        comments
      });

      setSubmitted(true);
      if (onScoreSubmitted) onScoreSubmitted();
    } catch (err) {
      alert(err.message || 'Scoring error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h4 className="font-bold text-cyan-400 text-sm flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" /> Evaluation Criteria Scorecard
        </h4>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block">Total Calculated Score</span>
          <span className="text-xl font-bold text-white">{totalScore} <span className="text-xs text-cyan-400">/ 100</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1. Innovation (25 marks) */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <div className="flex justify-between text-slate-300 font-bold">
            <span>1. Innovation & Novelty</span>
            <span className="text-cyan-400">{innovation} / 25</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            value={innovation}
            onChange={(e) => setInnovation(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* 2. Technical Implementation (25 marks) */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <div className="flex justify-between text-slate-300 font-bold">
            <span>2. Technical Implementation</span>
            <span className="text-cyan-400">{technical} / 25</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            value={technical}
            onChange={(e) => setTechnical(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* 3. Feasibility (20 marks) */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <div className="flex justify-between text-slate-300 font-bold">
            <span>3. Feasibility & Architecture</span>
            <span className="text-purple-400">{feasibility} / 20</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={feasibility}
            onChange={(e) => setFeasibility(Number(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer"
          />
        </div>

        {/* 4. Presentation (15 marks) */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <div className="flex justify-between text-slate-300 font-bold">
            <span>4. Presentation & Pitch</span>
            <span className="text-purple-400">{presentation} / 15</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            value={presentation}
            onChange={(e) => setPresentation(Number(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer"
          />
        </div>
      </div>

      {/* 5. Impact (15 marks) */}
      <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
        <div className="flex justify-between text-slate-300 font-bold">
          <span>5. Real-World Impact & Scalability</span>
          <span className="text-emerald-400">{impact} / 15</span>
        </div>
        <input
          type="range"
          min="0"
          max="15"
          value={impact}
          onChange={(e) => setImpact(Number(e.target.value))}
          className="w-full accent-emerald-400 cursor-pointer"
        />
      </div>

      {/* Judge Comments */}
      <div>
        <textarea
          placeholder="Enter constructive judge feedback & notes for this team..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={2}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        {submitted ? (
          <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
            <CheckCircle className="w-4 h-4" /> Score Lock Recorded
          </span>
        ) : (
          <span className="text-slate-500 text-[10px]">Review carefully before submitting final marks.</span>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 rounded-xl bg-cyan-500 text-[#050816] font-bold hover:bg-cyan-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.3)]"
        >
          {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
          <span>{submitted ? 'Update Score' : 'Submit Final Score'}</span>
        </button>
      </div>
    </form>
  );
};

export default JudgeScoreCard;
