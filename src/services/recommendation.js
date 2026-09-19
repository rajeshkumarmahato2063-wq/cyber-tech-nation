import teamMatchService from './teamMatch';

export const recommendationService = {
  // Generate AI team/teammate recommendations based on user profile
  async getRecommendations(currentProfile, limit = 4) {
    // If no user profile present, use default profile benchmark
    const benchmark = currentProfile || {
      skills: ['React', 'AI', 'Python'],
      preferred_domain: 'AI / Machine Learning',
      experience: 'Intermediate',
      college: 'IIT Bombay',
      availability: 'Full-time'
    };

    const { data: allProfiles } = await teamMatchService.getProfiles({}, 1, 50);

    // Exclude current user profile if present
    const candidates = allProfiles.filter(p => p.id !== benchmark.id && p.user_id !== benchmark.user_id);

    const scoredCandidates = candidates.map(candidate => {
      let score = 50; // Base score
      const matchReasons = [];

      // 1. Skill overlap (up to +25 points)
      const userSkills = benchmark.skills || [];
      const candidateSkills = candidate.skills || [];
      const sharedSkills = userSkills.filter(s => candidateSkills.includes(s));

      if (sharedSkills.length > 0) {
        score += Math.min(sharedSkills.length * 8, 25);
        matchReasons.push(`Shared skills: ${sharedSkills.slice(0, 2).join(', ')}`);
      }

      // 2. Domain alignment (+20 points)
      if (candidate.preferred_domain && candidate.preferred_domain === benchmark.preferred_domain) {
        score += 20;
        matchReasons.push(`Aligned innovation domain (${benchmark.preferred_domain})`);
      }

      // 3. College Diversity (+10 points if different college, fostering hackathon cross-college collabs)
      if (candidate.college && candidate.college !== benchmark.college) {
        score += 10;
        matchReasons.push(`Cross-college synergy (${candidate.college})`);
      }

      // 4. Complementary Experience (+10 points)
      if (benchmark.experience === 'Lead' && (candidate.experience === 'Intermediate' || candidate.experience === 'Beginner')) {
        score += 10;
        matchReasons.push('Great lead-to-builder experience balance');
      } else if (benchmark.experience === 'Beginner' && (candidate.experience === 'Advanced' || candidate.experience === 'Lead')) {
        score += 10;
        matchReasons.push('Strong mentor candidate available');
      } else if (candidate.experience === benchmark.experience) {
        score += 5;
        matchReasons.push('Matching experience level');
      }

      // 5. Availability matching (+10 points)
      if (candidate.availability === benchmark.availability || candidate.availability === 'Full-time') {
        score += 10;
        matchReasons.push(`Compatible availability (${candidate.availability})`);
      }

      const finalScore = Math.min(score, 98); // Max cap

      return {
        profile: candidate,
        score: finalScore,
        matchReasons
      };
    });

    // Sort by score descending
    scoredCandidates.sort((a, b) => b.score - a.score);

    return scoredCandidates.slice(0, limit);
  }
};

export default recommendationService;
