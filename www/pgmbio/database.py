from pymongo import MongoClient

import auth_utils

class DatabaseManager():
    def __init__(self):
        self.client = MongoClient("mongodb://localhost:27017")
        self.db = self.client["pgmlab"]
        self.users = self.db["users"]
        self.uploads = self.db["uploads"]
        self.pairwise_interactions = self.db["pairwise_interactions"]
        self.observations = self.db["observations"]
        self.parameters = self.db["parameters"]
        self.probabilities = self.db["probabilities"]
    # AUTHENTICATION
    # Upsert user into db
    def register_login_user(self, id_token, name, email):
        sub = auth_utils.validate_g_token(id_token=id_token)["sub"]
        print("...[dbm] register user {}".format(sub))
        user = self.users.find_one({"_id": sub})
        if not user:
            self.users.insert_one({
                "_id": sub,
                "name": name,
                "email": email
            })

    # UPLOADS
    def save_upload(self, upload_info, upload_json, id_token):
        print ("...[dbm] save upload")
        sub = auth_utils.validate_g_token(id_token=id_token)["sub"]
        upload = self.uploads.insert_one({
            "user_id": sub,
            "datetime": upload_info["datetime"],
            "type": upload_info["type"],
            "filename": upload_info["filename"],
            "success": upload_json["success"],
            "comments": upload_json["comments"]
        })
        upload_type = upload_info["type"]
        if upload_type == "pathway":
            pi = self.pairwise_interactions.insert_one({
                "_id": upload.inserted_id,
                "data": upload_json["data"],
                "filename": upload_info["filename"]
            })
        elif upload_type = "observation":
            obs = self.observations.insert_one({})
        elif upload_type = "parameters":
            pm = self.parameters.insert_one({})
        elif upload_type = "probabilities":
            pp = self.parameters.insert_one({})

    # Get all users uploads
    def get_all_uploads(self, sub_uid):
        return
