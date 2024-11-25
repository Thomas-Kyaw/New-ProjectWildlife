import pickle
import json

# Path to your .pickle file
pickle_file = "credentials/token.pickle"

try:
    # Open the .pickle file
    with open(pickle_file, "rb") as file:
        credentials = pickle.load(file)

    # Extract relevant data from the Credentials object
    credentials_data = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes,
    }

    # Save the extracted data to a JSON file
    with open("token.json", "w") as json_file:
        json.dump(credentials_data, json_file, indent=4)

    print("The contents have been saved to token.json")

except Exception as e:
    print(f"An error occurred: {e}")
