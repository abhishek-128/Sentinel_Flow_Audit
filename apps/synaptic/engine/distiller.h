#ifndef DISTILLER_H
#define DISTILLER_H

#include <string>
#include <vector>
#include <set>

namespace synaptic {

    class SatisfiabilityDistiller {
    public:
        SatisfiabilityDistiller();
        ~SatisfiabilityDistiller() = default;

        // Ingests logic propositions (e.g. from PDF text).
        void add_proposition(const std::string& prop);

        // Core logic simplifier (CDCL approximation using Jaccard Similarity and Subsumption)
        // Returns the minimized set of propositions removing logical redundancies.
        std::vector<std::string> distill();

    private:
        std::vector<std::string> propositions_;
        double similarity_threshold_ = 0.75;
        
        // Internal helper representing CDCL redundancy check.
        bool is_redundant(const std::string& prop, const std::vector<std::string>& active_set) const;

        // Tokenization for Jaccard index calculation
        std::set<std::string> tokenize(const std::string& text) const;

        // Calculates the Jaccard similarity between two sets of tokens
        double jaccard_similarity(const std::set<std::string>& a, const std::set<std::string>& b) const;
    };

} // namespace synaptic

#endif // DISTILLER_H
