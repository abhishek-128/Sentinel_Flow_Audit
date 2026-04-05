class SatisfiabilityDistiller:
    def __init__(self):
        self.propositions_ = []
        self.similarity_threshold_ = 0.75

    def add_proposition(self, prop: str):
        if prop:
            self.propositions_.append(prop)

    def distill(self):
        minimized = []
        for prop in self.propositions_:
            if not self.is_redundant(prop, minimized):
                minimized.append(prop)
        return minimized

    def tokenize(self, text: str):
        tokens = set()
        for word in text.split():
            cleaned = "".join(c.lower() for c in word if c.isalnum())
            if cleaned:
                tokens.add(cleaned)
        return tokens

    def jaccard_similarity(self, a: set, b: set):
        if not a and not b:
            return 1.0
        if not a or not b:
            return 0.0
        intersection = a.intersection(b)
        union = a.union(b)
        return len(intersection) / len(union)

    def is_redundant(self, prop: str, active_set: list):
        prop_tokens = self.tokenize(prop)
        if len(prop_tokens) < 3:
            return True

        for active_prop in active_set:
            active_tokens = self.tokenize(active_prop)
            sim = self.jaccard_similarity(prop_tokens, active_tokens)
            
            subsumed = prop_tokens.issubset(active_tokens)
            
            if sim > self.similarity_threshold_ or subsumed:
                return True
        return False
