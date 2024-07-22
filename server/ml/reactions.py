class Reaction:
    def __init__(self, starting_material, final_product, reaction_name):
        self.starting_material = starting_material
        self.final_product = final_product
        self.reaction_name = reaction_name

    def __str__(self):
        return f"{self.reaction_name}: {self.starting_material} -> {self.final_product}"

class Reactions:
    def __init__(self):
        self.reactions_list = []

    def add_reaction(self, reaction):
        self.reactions_list.append(reaction)

    def list_reactions(self):
        for reaction in self.reactions_list:
            print(reaction)

    def get_reactions(self):
        return self.reactions_list



