import sys
import json

def main(starting_material, final_product):
    # Placeholder for actual ML processing
    result = {
        "starting_material": starting_material,
        "final_product": final_product,
        "reaction": "This is a placeholder reaction."
    }
    print(json.dumps(result))

if __name__ == "__main__":
    starting_material = sys.argv[1]
    final_product = sys.argv[2]
    main(starting_material, final_product)