import pickle

# Path to your .pickle file
pickle_file = "credentials/token.pickle"

try:
    # Open the .pickle file in binary read mode
    with open(pickle_file, "rb") as file:
        data = pickle.load(file)

    # Print the contents of the .pickle file
    print("Contents of the .pickle file:")
    print(data)

except Exception as e:
    print(f"An error occurred: {e}")
