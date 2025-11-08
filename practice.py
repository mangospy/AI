import os, requests, json
k = os.getenv("GEMINI_API_KEY")
url = "https://generativelanguage.googleapis.com/v1beta/models"
r = requests.get(url, headers={"x-goog-api-key": k})
print(r.status_code)
print(json.dumps(r.json(), indent=2))
