#include "distiller.h"
#include <iostream>
#include <sstream>
#include <algorithm>
#include <iterator>

namespace synaptic {

    SatisfiabilityDistiller::SatisfiabilityDistiller() {
        // Initialization if needed
    }

    void SatisfiabilityDistiller::add_proposition(const std::string& prop) {
        if (!prop.empty()) {
            propositions_.push_back(prop);
        }
    }

    std::vector<std::string> SatisfiabilityDistiller::distill() {
        std::vector<std::string> minimized;
        
        for (const auto& prop : propositions_) {
            if (!is_redundant(prop, minimized)) {
                minimized.push_back(prop);
            }
        }
        
        return minimized;
    }

    std::set<std::string> SatisfiabilityDistiller::tokenize(const std::string& text) const {
        std::set<std::string> tokens;
        std::stringstream ss(text);
        std::string word;
        while (ss >> word) {
            // Convert to lowercase and remove basic punctuation for better comparison
            std::string cleaned;
            for (char c : word) {
                if (std::isalnum(c)) {
                    cleaned += std::tolower(c);
                }
            }
            if (!cleaned.empty()) {
                tokens.insert(cleaned);
            }
        }
        return tokens;
    }

    double SatisfiabilityDistiller::jaccard_similarity(const std::set<std::string>& a, const std::set<std::string>& b) const {
        if (a.empty() && b.empty()) return 1.0;
        if (a.empty() || b.empty()) return 0.0;

        std::vector<std::string> intersection;
        std::set_intersection(a.begin(), a.end(), b.begin(), b.end(), std::back_inserter(intersection));

        std::vector<std::string> unio;
        std::set_union(a.begin(), a.end(), b.begin(), b.end(), std::back_inserter(unio));

        return static_cast<double>(intersection.size()) / static_cast<double>(unio.size());
    }

    bool SatisfiabilityDistiller::is_redundant(const std::string& prop, const std::vector<std::string>& active_set) const {
        std::set<std::string> prop_tokens = tokenize(prop);
        if (prop_tokens.size() < 3) return true; // Prune overly short/meaningless fragments

        for (const auto& active_prop : active_set) {
            std::set<std::string> active_tokens = tokenize(active_prop);
            double sim = jaccard_similarity(prop_tokens, active_tokens);
            
            // Subsumption check (if all words in prop are in active_prop)
            bool subsumed = true;
            for (const auto& token : prop_tokens) {
                if (active_tokens.find(token) == active_tokens.end()) {
                    subsumed = false;
                    break;
                }
            }

            if (sim > similarity_threshold_ || subsumed) {
                return true; // Conflict/Redundancy learned! Prune this node.
            }
        }
        
        return false; 
    }

} // namespace synaptic
